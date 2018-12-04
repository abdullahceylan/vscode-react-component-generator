import FileConfig from './interfaces/files.interface';
import GlobalConfig from './interfaces/global.interface';
import { WorkspaceConfiguration } from 'vscode';

export interface Config extends WorkspaceConfiguration {
    global: GlobalConfig,
    files: FileConfig
};
