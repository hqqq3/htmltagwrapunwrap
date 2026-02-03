import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as vscode from 'vscode';

export function deleteTagUsingAST(document: vscode.TextDocument, position: vscode.Position, outputChannel: vscode.OutputChannel): boolean {
  const cursorOffset = document.offsetAt(position);
  const code = document.getText();

  try {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });

    let foundElement: any = null;
    let smallestRange: any = null;

    traverse(ast, {
      JSXElement(path) {
        const startOffset = (path.node as any).start;
        const endOffset = (path.node as any).end;

        if (cursorOffset >= startOffset && cursorOffset <= endOffset) {
          if (!smallestRange || (endOffset - startOffset) < (smallestRange.end - smallestRange.start)) {
            smallestRange = { start: startOffset, end: endOffset };
            foundElement = path.node;
          }
        }
      }
    });

    if (!foundElement || !smallestRange) {
      return false;
    }

    const startPos = document.positionAt(smallestRange.start);
    const endPos = document.positionAt(smallestRange.end);
    const tagName = (foundElement.openingElement.name as any).name || 'Fragment';

    const edit = new vscode.WorkspaceEdit();
    edit.delete(document.uri, new vscode.Range(startPos, endPos));
    vscode.workspace.applyEdit(edit);
    outputChannel.appendLine(`Deleted tag and its content: <${tagName}>`);

    return true;
  } catch (e) {
    return false;
  }
}
