import * as vscode from 'vscode';
import { deleteTagUsingAST } from '../parsers/astParser';
import { deleteTagUsingRegex } from '../parsers/htmlParser';

export function registerDeleteTagCommand(outputChannel: vscode.OutputChannel): vscode.Disposable {
  return vscode.commands.registerCommand('htmltagwrapunwrap.deleteTag', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const document = editor.document;
    const position = editor.selection.active;
    const filename = document.fileName;

    const isJsx = filename.endsWith('.jsx') || filename.endsWith('.tsx') || filename.endsWith('.js') || filename.endsWith('.ts');

    try {
      if (isJsx) {
        const success = deleteTagUsingAST(document, position, outputChannel);
        if (!success) {
          const regexSuccess = await deleteTagUsingRegex(document, position, outputChannel);
          if (!regexSuccess) {
            vscode.window.showWarningMessage('未找到光标所在的标签');
          }
        }
      } else {
        await deleteTagUsingRegex(document, position, outputChannel);
      }
    } catch (error) {
      console.error(error);
      vscode.window.showErrorMessage('删除标签失败');
    }
  });
}
