'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, workspace, window, commands } from 'vscode';
import { paramCase } from 'change-case';
import { Observable } from 'rxjs';
import { assign } from "lodash";

import { FileHelper, logger } from './helpers';
import { Config as ConfigInterface } from './config.interface';

const TEMPLATE_SUFFIX_SEPERATOR = '-';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    const createComponent = (uri, suffix: string = '') => {
        let configPrefix: String = 'AC.ReactComponentGenerator';
        let defaultConfig: ConfigInterface = FileHelper.getDefaultConfig();
        let userConfig: ConfigInterface = <ConfigInterface>workspace.getConfiguration((configPrefix + '.config'));
        let config: ConfigInterface;

        if (userConfig) {
            config = assign(config, defaultConfig, userConfig) as ConfigInterface;
        }

        // Display a dialog to the user
        let enterComponentNameDialog$ = Observable.from(
            window.showInputBox(
                {prompt: 'Please enter component name in camelCase then I can convert it to PascalCase for you.'}
            ));

        enterComponentNameDialog$
            .concatMap( val => {
                if (val.length === 0) {
                    logger('error', 'Component name can not be empty!');
                    throw new Error('Component name can not be empty!');
                }
                let componentName = paramCase(val);
                let componentDir = FileHelper.createComponentDir(uri, componentName, config.global);

                return Observable.forkJoin(
                    FileHelper.createComponent(componentDir, componentName, config.global, config.files, suffix),
                    FileHelper.createIndexFile(componentDir, componentName, config.global, config.files.index),
                    FileHelper.createCSS(componentDir, componentName, config.global, config.files.style),
                );
            })
            .concatMap(result => Observable.from(result))
            .filter(path => path.length > 0)
            .first()
            .concatMap(filename => Observable.from(workspace.openTextDocument(filename)))
            .concatMap(textDocument => {
                if (!textDocument) {
                    logger('error', 'Could not open file!');
                    throw new Error('Could not open file!');
                };
                return Observable.from(window.showTextDocument(textDocument))
            })
            .do(editor => {
                if (!editor) {
                    logger('error', 'Could not open file!');
                    throw new Error('Could not open file!')
                };
            })
            .subscribe(
                (c) => logger('success', 'React component successfully created!'),
                err => logger('error', err.message)
            );
    };

    const componentArray = [
        { type: "container", commandId: 'extension.genReactContainerComponentFiles' },
        { type: "stateless", commandId: 'extension.genReactStatelessComponentFiles' },
        { type: "reduxContainer", commandId: 'extension.genReactReduxContainerComponentFiles' },
        { type: "reduxStateless", commandId: 'extension.genReactReduxStatelessComponentFiles' },
    ];

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    componentArray.forEach(c => {
        const suffix = `${TEMPLATE_SUFFIX_SEPERATOR}${c.type}`;
        const disposable = commands.registerCommand(
            c.commandId, (uri) => createComponent(uri, suffix));
        
        // Add to a list of disposables which are disposed when this extension is deactivated.
        context.subscriptions.push(disposable);
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
    // code whe
}
