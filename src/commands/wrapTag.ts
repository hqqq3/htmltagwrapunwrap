import * as vscode from 'vscode';
import { getJSXElementAtCursor } from '../parsers/astParser';

export function registerWrapTagCommand(outputChannel: vscode.OutputChannel): vscode.Disposable {
  return vscode.commands.registerCommand('htmltagwrapunwrap.wrapTag', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const document = editor.document;
    const selection = editor.selection;
    const filename = document.fileName;
    let selectedText: string;
    let range: vscode.Range;

    if (selection.isEmpty) {
      const isJsx = filename.endsWith('.jsx') || filename.endsWith('.tsx') || filename.endsWith('.js') || filename.endsWith('.ts');
      
      if (isJsx) {
        const jsxElement = getJSXElementAtCursor(document, selection.active);
        if (jsxElement) {
          selectedText = jsxElement.text;
          range = jsxElement.range;
        } else {
          const line = document.lineAt(selection.active.line);
          selectedText = line.text;
          range = line.range;
        }
      } else {
        const line = document.lineAt(selection.active.line);
        selectedText = line.text;
        range = line.range;
      }
    } else {
      selectedText = document.getText(selection);
      range = selection;
    }

    const tagName = 'div';
    const wrappedText = `<${tagName}>${selectedText}</${tagName}>`;

    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, range, wrappedText);
    await vscode.workspace.applyEdit(edit);

    outputChannel.appendLine(`Wrapped selection with tag: <${tagName}>`);
  });
}
