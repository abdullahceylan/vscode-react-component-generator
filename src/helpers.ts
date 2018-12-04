import { workspace, window } from 'vscode';
import * as fse from 'fs-extra';
import * as fs from 'fs';
import * as path from 'path';
import { pascalCase } from 'change-case';
import { Observable } from 'rxjs';
import FileInterface from './interfaces/files.interface';
import GlobalInterface from './interfaces/global.interface';
// import { Config as ConfigInterface } from './config.interface';
import {
    IndexInterface,
    CSSInterface,
} from './interfaces/types';

export class FileHelper {
    private static sourceDir: string = path.join(__dirname, '../../src');
    private static assetRootDir: string = path.join(__dirname, '../../assets');

    private static createFile = <(file: string, data: string) => Observable<{}>>Observable.bindNodeCallback(fse.outputFile);

    public static createComponentDir(uri: any, componentName: string, globalConfig: GlobalInterface): string {
        let contextMenuSourcePath;

        if (uri && fs.lstatSync(uri.fsPath).isDirectory()) {
            contextMenuSourcePath = uri.fsPath;
        } else if (uri) {
            contextMenuSourcePath = path.dirname(uri.fsPath);
        } else {
            contextMenuSourcePath = workspace.rootPath;
        }

        let componentDir = `${contextMenuSourcePath}`;
        if(globalConfig.generateFolder) {
            componentDir = `${contextMenuSourcePath}/${this.setName(componentName)}`;
            fse.mkdirsSync(componentDir);
        }

        return componentDir;
    }

    public static createComponent(componentDir: string, componentName: string, globalConfig: GlobalInterface, config: FileInterface, suffix: string = '-container'): Observable<string> {
        
        let templateFileName = this.assetRootDir + `/templates/component${suffix}.template`;
        if (config.component.template) {
            templateFileName = this.resolveWorkspaceRoot(config.component.template);
        }

        const compName = this.setName(componentName);

        let componentContent = fs.readFileSync( templateFileName ).toString()
            .replace(/{componentName}/g, compName)
            .replace(/{quotes}/g, this.getQuotes(globalConfig));

        let filename = `${componentDir}/${compName}.${config.component.extension}`;

        if (config.component.create) {
            return this.createFile(filename, componentContent)
                .map(result => filename);
        }
        else {
            return Observable.of('');
        }
    };

    public static createIndexFile(componentDir: string, componentName: string, globalConfig: GlobalInterface, config: IndexInterface): Observable<string> {
        let templateFileName = this.assetRootDir + '/templates/index.template';
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        const compName = this.setName(componentName);
        let indexContent = fs.readFileSync( templateFileName ).toString()
            .replace(/{componentName}/g, compName)
            .replace(/{quotes}/g, this.getQuotes(globalConfig));

        let filename = `${componentDir}/index.${config.extension}`;
        if (config.create) {
            return this.createFile(filename, indexContent)
                .map(result => filename);
        }
        else {
            return Observable.of('');
        }
    };

    public static createCSS(componentDir: string, componentName: string, globalConfig: GlobalInterface, config: CSSInterface): Observable<string> {
        let templateFileName = this.assetRootDir + '/templates/css.template';
        if (config.type === 'emotion') {
            templateFileName = this.assetRootDir + '/templates/css-emotion.template';
        } else if (config.type === 'styled') {
            templateFileName = this.assetRootDir + '/templates/css-styled.template';
        }
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        const compName = this.setName(componentName);
        let cssContent = fs.readFileSync( templateFileName ).toString()
            .replace(/{componentName}/g, compName)
            .replace(/{quotes}/g, this.getQuotes(globalConfig));

        let filename = `${componentDir}/${compName}${config.suffix}.${config.extension}`;
        if (config.create) {
            return this.createFile(filename, cssContent)
                .map(result => filename);
        }
        else {
            return Observable.of('');
        }
    };

    public static getDefaultConfig(): any {
        let content = fs.readFileSync( this.sourceDir + '/config/config.json' ).toString();
        content = content.replace(/\${workspaceFolder}/g, workspace.rootPath);
        return JSON.parse(content);
    }

    public static resolveWorkspaceRoot = (path: string): string => path.replace('${workspaceFolder}', workspace.rootPath)

    private static getQuotes = (config: GlobalInterface) => config.quotes === "double" ? '"' : '\''

    public static setName = (name: string) => pascalCase(name)
}

export function logger(type: 'success'|'warning'|'error', msg: string = '') {
    console.log(msg);
    switch (type) {
    case 'success':
        return window.setStatusBarMessage(`Success: ${msg}`, 5000);
        // return window.showInformationMessage(`Success: ${msg}`);
    case 'warning':
        return window.showWarningMessage(`Warning: ${msg}`);
    case 'error':
        return window.showErrorMessage(`Failed: ${msg}`);
    }
  }