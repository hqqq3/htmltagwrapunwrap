.PHONY: compile package install clean all

# 编译 TypeScript 代码
compile:
	npm run compile

# 打包扩展为 .vsix 文件
package: compile
	npx vsce package

# 安装扩展到 VS Code
install: package
	code --install-extension htmltagwrapunwrap-*.vsix
	trae --install-extension htmltagwrapunwrap-*.vsix
	/Applications/Trae\ CN.app/Contents/Resources/app/bin/trae --install-extension htmltagwrapunwrap-*.vsix
# 清理编译产物和打包文件
clean:
	rm -rf out/
	rm -f htmltagwrapunwrap-*.vsix

# 完整流程：清理 -> 编译 -> 打包 -> 安装
all: clean compile package install
