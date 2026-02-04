# HTML Tag Wrap Unwrap

VS Code 插件，用于 HTML 标签的包裹和删除操作。

## 功能

- **删除标签 (Alt + D)**: 删除光标所在的 HTML/JSX 标签及其内容
- **包裹标签 (Alt + W)**: 用 `<div>` 标签包裹选中的文本或整个 JSX 元素

## 安装

### 从 VSIX 安装

1. 下载最新的 `.vsix` 文件
2. 打开 VS Code
3. 按 `Cmd + Shift + P` (Mac) 或 `Ctrl + Shift + P` (Windows/Linux)
4. 输入 "Install from VSIX..."
5. 选择下载的 `.vsix` 文件

### 使用 Makefile 安装

```bash
make install
```

## 使用方法

### 删除标签

1. 将光标放在要删除的标签上
2. 按 `Alt + D`
3. 标签及其内容将被删除

### 包裹标签

1. 选中要包裹的文本，或将光标放在 JSX 元素上
2. 按 `Alt + W`
3. 选中的内容或整个 JSX 元素将被包裹在 `<div>` 标签中

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Alt + D` | 删除标签 |
| `Alt + W` | 包裹标签 |

## 开发

### 环境要求

- Node.js
- npm

### 安装依赖

```bash
npm install
```

### 编译

```bash
npm run compile
```

### 调试

1. 按 `F5` 启动扩展开发宿主
2. 在新的 VS Code 窗口中测试功能

### 使用 Makefile

```bash
make compile    # 编译 TypeScript
make package    # 打包为 .vsix 文件
make install    # 安装到 VS Code
make clean      # 清理编译产物
make all        # 完整流程：编译 -> 打包 -> 安装
```

## 项目结构

```
src/
├── commands/       # 命令实现
│   ├── deleteTag.ts    # 删除标签命令
│   └── wrapTag.ts      # 包裹标签命令
├── parsers/        # 解析逻辑
│   ├── astParser.ts    # JSX/TSX AST 解析
│   └── htmlParser.ts   # HTML 正则解析
└── extension.ts    # 扩展入口
```

## License

MIT
