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
│   ├── commands/           # Command implementations
│   │   └── deleteTag.ts    # Delete tag command
│   ├── parsers/           # Parsing logic
│   │   ├── astParser.ts   # JSX/TSX AST-based parsing
│   │   └── htmlParser.ts   # HTML regex-based parsing
│   └── extension.ts       # Main extension entry point
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
- Group imports: vscode API first, then project modules

### Code Style

#### Naming Conventions
- **Commands**: Use kebab-case with prefix (e.g., `htmltagwrapunwrap.deleteTag`)
- **Variables**: Use camelCase (e.g., `deleteTagCommand`, `outputChannel`)
- **Functions**: Use camelCase (e.g., `activate`, `deactivate`, `registerDeleteTagCommand`)
- **Constants**: Use camelCase for local, UPPER_CASE for exported constants
- **Files**: Use camelCase for files (e.g., `deleteTag.ts`, `astParser.ts`)

#### Async/Await
- Mark command callbacks as async: `vscode.commands.registerCommand('...', async () => {})`
- Use async/await for async operations
- Return boolean from parsing functions to indicate success/failure

#### Comments
- Keep concise, only explain key logic blocks
- Max 1 sentence per comment
- Don't add comments unless necessary

#### Code Organization
- Register commands in `activate()` function
- Add all disposables to `context.subscriptions`
- Export `activate()` and `deactivate()` functions from main entry point
- Use output channels for logging and debug information
- Separate commands into `src/commands/` directory
- Separate parsing logic into `src/parsers/` directory

### Error Handling
- Wrap operations in try-catch blocks
- Use `vscode.window.showErrorMessage()` for user-facing errors
- Use `showWarningMessage()` for warnings, `showInformationMessage()` for info
- Log errors to console for debugging
- Return boolean from functions to indicate success/failure

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
const position = selection.active;
```

**Text Editing:**
```typescript
const edit = new vscode.WorkspaceEdit();
edit.replace(document.uri, new vscode.Range(start, end), newText);
await vscode.workspace.applyEdit(edit);
```

**File Type Detection:**
```typescript
const filename = document.fileName;
const isJsx = filename.endsWith('.jsx') || filename.endsWith('.tsx') || filename.endsWith('.js') || filename.endsWith('.ts');
```

### Extension Manifest (package.json)

Add commands and keybindings in `contributes` section matching registered command names:
- Commands must be declared under `contributes.commands`
- Keybindings must reference commands from the contributes section
- Use descriptive Chinese titles for commands

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

**Output Channel Usage:**
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
- JSX/TSX files use AST-based parsing, HTML files use regex-based parsing
