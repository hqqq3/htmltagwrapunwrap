# AGENTS.md

This file contains guidelines and commands for coding agents working on this VS Code extension project.

## Build and Development Commands

### Build Commands
- `npm run compile` - Compile TypeScript to JavaScript (outputs to `out/` directory)
- `npm run watch` - Compile TypeScript in watch mode (runs in background)
- `npm run vscode:prepublish` - Prepare extension for publishing (compile)

### Testing Commands
This project currently has no test framework set up. When adding tests:
- Consider using Mocha, Jest, or VS Code's test framework
- Add a test script to package.json (e.g., `"test": "npm run compile && node ./out/test/runTest.js"`)
- To run a single test: Add specific test file pattern to the test command

### Debugging
- Press `F5` in VS Code to launch extension development host
- Use the Extension Development Host window for testing
- Developer tools available via Help > Toggle Developer Tools

## Project Structure
```
htmltagwrapunwrap/
├── src/                    # Source TypeScript files
│   └── extension.ts        # Main extension entry point
├── out/                    # Compiled JavaScript (generated)
├── .vscode/
│   ├── launch.json         # Debug configuration
│   └── tasks.json          # Build tasks
├── package.json            # Extension manifest
└── tsconfig.json           # TypeScript configuration
```

## Code Style Guidelines

### TypeScript Configuration
- **Strict mode**: Enabled (`strict: true`)
- **Target**: ES2020
- **Module system**: CommonJS
- **Output directory**: `out/`
- **Source maps**: Enabled
- **Consistent casing**: Enforced

### Import Statements
- Use namespace imports for vscode API: `import * as vscode from 'vscode';`
- Use ES6 imports for other modules
- Place imports at the top of the file

### Code Style

#### Naming Conventions
- **Commands**: Use kebab-case with prefix (e.g., `htmltagwrapunwrap.deleteTag`)
- **Variables**: Use camelCase (e.g., `deleteTagCommand`, `outputChannel`)
- **Functions**: Use camelCase (e.g., `activate`, `deactivate`)
- **Constants**: Use camelCase or UPPER_CASE for exports

#### Async/Await
- Mark command callbacks as async: `vscode.commands.registerCommand('...', async () => {})`
- Use async/await for async operations
- Use console.log for debugging in development

#### Comments
- Keep concise, only explain key logic blocks
- Max 1 sentence per comment
- Don't add comments unless necessary

#### Code Organization
- Register commands in `activate()` function
- Add all disposables to `context.subscriptions`
- Export `activate()` and `deactivate()` functions from main entry point
- Use output channels for logging and debug information

### Error Handling
- Wrap operations in try-catch, use `vscode.window.showErrorMessage()` for user-facing errors
- Use `showWarningMessage()` for warnings, `showInformationMessage()` for info
- Log errors to console for debugging

### VS Code Extension API Patterns

**Command Registration:**
```typescript
const command = vscode.commands.registerCommand('extension.action', async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  // Command logic
});
context.subscriptions.push(command);
```

**Output Channel:**
```typescript
const outputChannel = vscode.window.createOutputChannel('Name');
context.subscriptions.push(outputChannel);
outputChannel.appendLine('Message');
outputChannel.show();
```

**Editor Text Access:**
```typescript
const editor = vscode.window.activeTextEditor;
if (!editor) return;
const document = editor.document;
const selection = editor.selection;
const text = document.getText(selection);
```

**Text Editing:**
```typescript
const edit = new vscode.WorkspaceEdit();
edit.replace(document.uri, new vscode.Range(start, end), newText);
await vscode.workspace.applyEdit(edit);
```

### Extension Manifest (package.json)

Add commands and keybindings in `contributes` section matching registered command names.

## Development Workflow

1. Make changes to TypeScript files in `src/`
2. Run `npm run watch` to automatically compile changes
3. Press `F5` to launch extension development host
4. Test changes in the development host window
5. Check output channel and developer tools console for logs
6. Before committing, ensure `npm run compile` passes without errors

## Common Patterns

**Command with Error Handling:**
```typescript
const command = vscode.commands.registerCommand('extension.action', async () => {
  try {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    // Process document
  } catch (error) {
    console.error(error);
    vscode.window.showErrorMessage('Operation failed');
  }
});
context.subscriptions.push(command);
```

**Output Channel:**
```typescript
const outputChannel = vscode.window.createOutputChannel('Extension Name');
context.subscriptions.push(outputChannel);
outputChannel.appendLine('Log message');
outputChannel.show(true); // Preserve focus
```

## Important Notes

- Always run `npm run compile` before testing
- All commands must be declared in `package.json` under `contributes.commands`
- Keybindings must reference commands from the contributes section
- Dispose all resources (output channels, event listeners) in subscriptions
- Use the development host for testing, not the main VS Code window
- Check developer tools console for detailed error messages
