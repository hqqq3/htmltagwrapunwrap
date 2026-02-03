import * as vscode from 'vscode';
import { registerDeleteTagCommand } from './commands/deleteTag';
import { registerWrapTagCommand } from './commands/wrapTag';

export function activate(context: vscode.ExtensionContext) {
  console.log('HTML Tag Wrap Unwrap 插件已激活');

  const outputChannel = vscode.window.createOutputChannel('HTML Tag Wrap Unwrap');
  context.subscriptions.push(outputChannel);

  const deleteTagCommand = registerDeleteTagCommand(outputChannel);
  const wrapTagCommand = registerWrapTagCommand(outputChannel);

  context.subscriptions.push(deleteTagCommand, wrapTagCommand);
  console.log('命令已注册');
}

export function deactivate() {}
