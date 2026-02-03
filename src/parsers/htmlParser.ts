import * as vscode from 'vscode';

export async function deleteTagUsingRegex(document: vscode.TextDocument, position: vscode.Position, outputChannel: vscode.OutputChannel): Promise<boolean> {
  const lineText = document.lineAt(position).text;
  const textBeforeCursor = lineText.substring(0, position.character);

  const lastTagStart = textBeforeCursor.lastIndexOf('<');
  if (lastTagStart === -1) {
    vscode.window.showWarningMessage('未找到标签');
    return false;
  }

  const tagContent = lineText.substring(lastTagStart);
  const tagNameMatch = tagContent.match(/^<([^\s>\/]+)/);
  if (!tagNameMatch) {
    vscode.window.showWarningMessage('无效的标签格式');
    return false;
  }

  const tagName = tagNameMatch[1];
  const isSelfClosing = tagContent.match(/^\s*\/\s*>/) !== null;

  if (isSelfClosing) {
    const tagEndPos = lineText.indexOf('>', lastTagStart);
    const startPos = new vscode.Position(position.line, lastTagStart);
    const endPos = new vscode.Position(position.line, tagEndPos + 1);
    const edit = new vscode.WorkspaceEdit();
    edit.delete(document.uri, new vscode.Range(startPos, endPos));
    await vscode.workspace.applyEdit(edit);
    outputChannel.appendLine(`已删除自闭合标签: <${tagName} />`);
    return true;
  }

  const openTagEndPos = lineText.indexOf('>', lastTagStart);
  if (openTagEndPos === -1) {
    vscode.window.showWarningMessage('未找到标签结束位置');
    return false;
  }

  const openTagStartPos = new vscode.Position(position.line, lastTagStart);
  const openTagEndPosition = new vscode.Position(position.line, openTagEndPos + 1);

  let closeTagStartPos: vscode.Position | null = null;
  let closeTagEndPos: vscode.Position | null = null;
  let depth = 0;

  for (let i = position.line; i < document.lineCount; i++) {
    const currentLineText = document.lineAt(i).text;
    const openTagRegex = new RegExp(`<${tagName}(?:\\s[^>]*)?>`, 'g');
    const closeTagRegex = new RegExp(`<\\s*\\/${tagName}\\s*>`, 'g');

    if (i === position.line) {
      const afterOpenTag = currentLineText.substring(openTagEndPos + 1);
      const closeMatches = [...afterOpenTag.matchAll(closeTagRegex)];
      if (closeMatches.length > 0) {
        closeTagStartPos = new vscode.Position(i, openTagEndPos + 1 + closeMatches[0].index);
        closeTagEndPos = new vscode.Position(i, openTagEndPos + 1 + closeMatches[0].index + closeMatches[0][0].length);
        break;
      }
      const openMatches = [...afterOpenTag.matchAll(openTagRegex)];
      depth += openMatches.length;
    } else {
      const closeMatches = [...currentLineText.matchAll(closeTagRegex)];
      for (const match of closeMatches) {
        if (depth === 0) {
          closeTagStartPos = new vscode.Position(i, match.index);
          closeTagEndPos = new vscode.Position(i, match.index + match[0].length);
          break;
        }
        depth--;
      }
      if (closeTagStartPos) break;

      const openMatches = [...currentLineText.matchAll(openTagRegex)];
      depth += openMatches.length;
    }
  }

  if (!closeTagStartPos || !closeTagEndPos) {
    vscode.window.showWarningMessage('未找到匹配的结束标签');
    return false;
  }

  const edit = new vscode.WorkspaceEdit();
  edit.delete(document.uri, new vscode.Range(openTagStartPos, closeTagEndPos));
  await vscode.workspace.applyEdit(edit);
  outputChannel.appendLine(`已删除标签及其内容: <${tagName}>...</${tagName}>`);

  return true;
}
