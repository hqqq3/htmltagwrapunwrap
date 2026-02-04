import * as vscode from 'vscode';
import { deleteTagUsingAST } from '../parsers/astParser';
import { deleteTagUsingRegex } from '../parsers/htmlParser';

export function registerDeleteTagCommand(outputChannel: vscode.OutputChannel): vscode.Disposable {
  const deleteTagOnlyCommand = vscode.commands.registerCommand('htmltagwrapunwrap.deleteTag', async () => {
    await executeDeleteTag(outputChannel, false);
  });

  const deleteTagWithContentCommand = vscode.commands.registerCommand('htmltagwrapunwrap.deleteTagWithContent', async () => {
    await executeDeleteTag(outputChannel, true);
  });

  return vscode.Disposable.from(deleteTagOnlyCommand, deleteTagWithContentCommand);
}

async function executeDeleteTag(outputChannel: vscode.OutputChannel, deleteContent: boolean): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const document = editor.document;
  const position = editor.selection.active;
  const filename = document.fileName;

  const isJsx = filename.endsWith('.jsx') || filename.endsWith('.tsx') || filename.endsWith('.js') || filename.endsWith('.ts');

  try {
    if (isJsx) {
      const success = deleteTagUsingAST(document, position, outputChannel, deleteContent);
      if (!success) {
        const regexSuccess = await deleteTagUsingRegex(document, position, outputChannel, deleteContent);
        if (!regexSuccess) {
          vscode.window.showWarningMessage('No tag found at cursor position');
        }
      }
    } else {
      await deleteTagUsingRegex(document, position, outputChannel, deleteContent);
    }
  } catch (error) {
    console.error(error);
    vscode.window.showErrorMessage('Failed to delete tag');
  }
}
