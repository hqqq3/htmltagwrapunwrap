# HTML Tag Wrap Unwrap

A VS Code extension for wrapping and deleting HTML tags.

## Features

- **Delete Tag (Alt + D)**: Delete the HTML/JSX tag at cursor position (keep content)
- **Delete Tag and Content (Alt + Shift + D)**: Delete the HTML/JSX tag and its content
- **Wrap Tag (Alt + W)**: Wrap selected text or entire JSX element with `<div>` tag

## Installation

### Install from VSIX

1. Download the latest `.vsix` file from https://github.com/hqqq3/htmltagwrapunwrap/releases
2. Open VS Code
3. Press `Cmd + Shift + P` (Mac) or `Ctrl + Shift + P` (Windows/Linux)
4. Type "Install from VSIX..."
5. Select the downloaded `.vsix` file

### Install with Makefile

```bash
make install
```

## Usage

### Delete Tag (Keep Content)

1. Place cursor on the tag you want to delete
2. Press `Alt + D`
3. Tag will be deleted, content remains

### Delete Tag and Content

1. Place cursor on the tag you want to delete
2. Press `Alt + Shift + D`
3. Tag and its content will be deleted

### Wrap Tag

1. Select text to wrap, or place cursor on a JSX element
2. Press `Alt + W`
3. Selected content or entire JSX element will be wrapped with `<div>` tag

## Keybindings

| Keybinding | Action |
|------------|--------|
| `Alt + D` | Delete Tag (Keep Content) |
| `Alt + Shift + D` | Delete Tag and Content |
| `Alt + W` | Wrap Tag |

## Development

### Requirements

- Node.js
- npm

### Install Dependencies

```bash
npm install
```

### Compile

```bash
npm run compile
```

### Debug

1. Press `F5` to launch Extension Development Host
2. Test functionality in the new VS Code window

### Makefile Commands

```bash
make compile    # Compile TypeScript
make package    # Package as .vsix file
make install    # Install to VS Code
make clean      # Clean build artifacts
make all        # Full workflow: compile -> package -> install
```

## Project Structure

```
src/
├── commands/       # Command implementations
│   ├── deleteTag.ts    # Delete tag command
│   └── wrapTag.ts      # Wrap tag command
├── parsers/        # Parsing logic
│   ├── astParser.ts    # JSX/TSX AST parsing
│   └── htmlParser.ts   # HTML regex parsing
└── extension.ts    # Extension entry point
```

## License

MIT
