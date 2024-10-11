// @ts-nocheck
import { workspace, Uri, window } from "vscode";
import * as fse from "fs-extra";
import * as fs from "fs";
import * as path from "path";
import { pascalCase, dotCase } from "change-case";
import { Observable } from "rxjs";
import {
  IndexInterface,
  CSSInterface,
  ComponentInterface,
} from "./interfaces/types";
import GlobalInterface from "./interfaces/global.interface";
export class FileHelper {
  private static assetRootDir: string = path.join(__dirname, "../../assets");

  private static createFile = <(file: string, data: string) => Observable<{}>>(
    Observable.bindNodeCallback(fse.outputFile)
  );

  public static createComponentDir(
    uri: any,
    componentName: string,
    isRemixRouteFile?: boolean
  ): string {
    let contextMenuSourcePath;
    const globalConfig: GlobalInterface = getConfig().get("global");

    if (uri && fs.lstatSync(uri.fsPath).isDirectory()) {
      contextMenuSourcePath = uri.fsPath;
    } else if (uri) {
      contextMenuSourcePath = path.dirname(uri.fsPath);
    } else {
      contextMenuSourcePath = workspace.rootPath;
    }

    let componentDir = `${contextMenuSourcePath}`;
    if (globalConfig.generateFolder) {
      componentDir = `${contextMenuSourcePath}/${this.setName(componentName)}`;
      if (!isRemixRouteFile) fse.mkdirsSync(componentDir);
    }

    return componentDir;
  }

  public static getExtension = (ext: string) => {
    switch (ext) {
      case "TypeScript (.tsx)":
        return "tsx";
      case "JSX (.jsx)":
        return "jsx";
      case "Vanilla (.js)":
        return "js";
      case "TypeScript (.ts)":
        return "ts";
      default:
        return ext;
    }
  };

  public static createComponent(
    componentDir: string,
    componentName: string,
    suffix: string = "-container"
  ): Observable<string> {
    const globalConfig: GlobalInterface = getConfig().get("global");
    const componentConfig: ComponentInterface = getConfig().get("mainFile");
    let templateFileName =
      this.assetRootDir + `/templates/component${suffix}.template`;
    if (componentConfig.template) {
      templateFileName = this.resolveWorkspaceRoot(componentConfig.template);
    }

    const compName = this.setName(componentName);
    const removeLifecycleType =
      globalConfig.lifecycleType == "legacy" ? "reactv16" : "legacy";
    console.log("removeLifecycleType", removeLifecycleType);

    let componentContent = fs
      .readFileSync(templateFileName)
      .toString()
      .replace(/{componentName}/g, compName)
      .replace(/{quotes}/g, this.getQuotes(globalConfig));

    componentContent = removeBetweenTags(
      globalConfig.lifecycleType,
      removeLifecycleType,
      componentContent
    );

    let filename = `${componentDir}/${compName}.${this.getExtension(
      componentConfig.extension
    )}`;

    if (componentConfig.create) {
      return this.createFile(filename, componentContent).map(
        (result) => filename
      );
    } else {
      return Observable.of("");
    }
  }

  public static createIndexFile(
    componentDir: string,
    componentName: string
  ): Observable<string> {
    const globalConfig: GlobalInterface = getConfig().get("global");
    const indexConfig: IndexInterface = getConfig().get("indexFile");

    let templateFileName = this.assetRootDir + "/templates/index.template";
    if (indexConfig.template) {
      templateFileName = this.resolveWorkspaceRoot(indexConfig.template);
    }

    const compName = this.setName(componentName);
    let indexContent = fs
      .readFileSync(templateFileName)
      .toString()
      .replace(/{componentName}/g, compName)
      .replace(/{quotes}/g, this.getQuotes(globalConfig));

    let filename = `${componentDir}/index.${this.getExtension(
      indexConfig.extension
    )}`;
    if (indexConfig.create) {
      return this.createFile(filename, indexContent).map((result) => filename);
    } else {
      return Observable.of("");
    }
  }

  public static createRemixRouteFile(
    componentDir: string,
    componentName: string
  ): Observable<string> {
    const globalConfig: GlobalInterface = getConfig().get("global");
    const indexConfig: IndexInterface = getConfig().get("indexFile");

    let templateFileName =
      this.assetRootDir + "/templates/component-typescript-remix.template";
    if (indexConfig.template) {
      templateFileName = this.resolveWorkspaceRoot(indexConfig.template);
    }

    const compName = this.setName(componentName);
    const templateContent = fs
      .readFileSync(templateFileName)
      .toString()
      .replace(/{componentName}/g, compName)
      .replace(/{quotes}/g, this.getQuotes(globalConfig));

    const filename = `${componentDir.path}/app.${dotCase(
      compName
    )}.${this.getExtension(indexConfig.extension)}`;
    if (indexConfig.create) {
      return this.createFile(filename, templateContent).map(
        (result) => filename
      );
    } else {
      return Observable.of("");
    }
  }

  public static createCSS(
    componentDir: string,
    componentName: string
  ): Observable<string> {
    const globalConfig: GlobalInterface = getConfig().get("global");
    const styleConfig: CSSInterface = getConfig().get("styleFile");
    const styleTemplate = getStyleSheetExtTemplate();
    let templateFileName = `${this.assetRootDir}/templates/${styleTemplate.template}`;

    const compName = this.setName(componentName);
    let cssContent = fs
      .readFileSync(templateFileName)
      .toString()
      .replace(/{componentName}/g, compName)
      .replace(/{quotes}/g, this.getQuotes(globalConfig));

    let filename = `${componentDir}/${compName}${styleConfig.suffix.replace(
      "none",
      ""
    )}.${styleTemplate.ext}`;
    if (styleConfig.create) {
      return this.createFile(filename, cssContent).map((result) => filename);
    } else {
      return Observable.of("");
    }
  }

  public static resolveWorkspaceRoot = (path: string): string =>
    path.replace("${workspaceFolder}", workspace.rootPath);

  private static getQuotes = (config: GlobalInterface) =>
    config.quotes === "double" ? '"' : "'";

  public static setName = (name: string) => pascalCase(name);
}

export function logger(
  type: "success" | "warning" | "error",
  msg: string = ""
) {
  switch (type) {
    case "success":
      return window.setStatusBarMessage(`Success: ${msg}`, 5000);
    // return window.showInformationMessage(`Success: ${msg}`);
    case "warning":
      return window.showWarningMessage(`Warning: ${msg}`);
    case "error":
      return window.showErrorMessage(`Failed: ${msg}`);
  }
}

export default function getConfig(uri?: Uri) {
  return workspace.getConfiguration("ACReactComponentGenerator", uri) as any;
}

export function getStyleSheetExtTemplate() {
  const configuredView = getConfig().get("styleFile.type");
  let styleTemplate = {
    ext: "css",
    template: "css.template",
  };

  switch (configuredView) {
    case "styled-components/emotion (.js)":
      styleTemplate = { ext: "js", template: "css-styled.template" };
      break;
    case "sass (.sass)":
      styleTemplate.ext = "sass";
      break;
    case "sass (.scss)":
      styleTemplate.ext = "scss";
      break;
    case "less (.less)":
      styleTemplate.ext = "less";
      break;
  }

  return styleTemplate;
}

export function removeBetweenTags(remainTag, removedtag, content) {
  const escapeRegExp = (s) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regexPattern = RegExp(
    `${escapeRegExp(`<${removedtag}>`)}([\\S\\s]+?)${escapeRegExp(
      `</${removedtag}>`
    )}`,
    "gi"
  );
  const removeOnlyTagsPattern = new RegExp(
    `<(${escapeRegExp(remainTag)}|/${escapeRegExp(remainTag)})[^>]{0,}>`,
    "gi"
  );

  return content.replace(regexPattern, "").replace(removeOnlyTagsPattern, "");
}
