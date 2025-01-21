# VSCode

## Extensions

- ESlint(dbaeumer.vscode-eslint)
- Markdown All in One(yzhang.markdown-all-in-one)
- Vue(Vue.volar)
- Error Lens(usernamehw.errorlens)

### Visual Studio Code Remote - Containers

### Visual Studio Code Remote - SSH

### Visual Studio Code Remote - SSH: Editing Configuration Files

### Visual Studio Code Remote - SSH: Explorer

### Visual Studio Code Remote - WSL

### Visual Studio Code Remote Development Extension Pack

### GitLens — Git supercharged

### Live Server

## 配置

```JSON
{
  "editor.quickSuggestions": {
    "other": true,
    "comments": false,
    "strings": true
  },
  "workbench.startupEditor": "welcomePage",
  "editor.wordWrap": "on",
  "editor.formatOnSave": false,
  "[python]": {
    "editor.formatOnType": true
  },
  "[html]": {
    "editor.defaultFormatter": "vscode.html-language-features"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[less]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
  },
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "[json]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "git.autofetch": true,
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "prettier.vueIndentScriptAndStyle": true,
  "editor.tabSize": 2,
  "editor.suggestSelection": "first",
  "files.eol": "\n",
  "dart.devToolsBrowser": "default",
  "[dart]": {
    "editor.formatOnSave": true,
    "editor.formatOnType": true,
    "editor.rulers": [
      80
    ],
    "editor.selectionHighlight": false,
    "editor.suggest.snippetsPreventQuickSuggestions": false,
    "editor.suggestSelection": "first",
    "editor.tabCompletion": "onlySnippets",
    "editor.wordBasedSuggestions": "off"
  },
  "workbench.editor.wrapTabs": true,
  "editor.unicodeHighlight.nonBasicASCII": false,
  "[dockerfile]": {
    "editor.defaultFormatter": "ms-azuretools.vscode-docker"
  },
  "gitlens.views.worktrees.showBranchComparison": "branch",
  "editor.inlineSuggest.enabled": true,
  "github.copilot.enable": {
    "*": true,
    "plaintext": false,
    "markdown": false,
    "scminput": false,
    "yaml": false,
    "dotenv": false,
    "json": true
  },
  "search.followSymlinks": false,
  "search.exclude": {
    "**/.svn": true,
    "**/.hg": true,
    "**/CVS": true,
    "**/.DS_Store": true,
    "**/tmp": true,
    "**/node_modules": true,
    "**/bower_components": true,
    "**/dist": true,
    "**/.output": true,
    "**/.output-csr": true,
    "**/.nuxt": true,
    "**/.next": true,
    "**/.clinic": true,
  },
  "files.watcherExclude": {
    "**/.dart_tool": true,
    "**/bower_components": true,
  },
  "files.exclude": {
    "**/.svn": true,
    "**/.hg": true,
    "**/CVS": true,
    "**/.DS_Store": true,
    "**/bower_components": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "html",
    "vue",
    "typescript",
    "typescriptreact"
  ],
  "javascript.suggest.autoImports": false,
  "typescript.suggest.autoImports": false,
  "typescript.updateImportsOnFileMove.enabled": "never",
  "workbench.layoutControl.enabled": false,
  "debug.javascript.autoAttachFilter": "smart",
  "application.shellEnvironmentResolutionTimeout": 70,
  "files.associations": {
    "*.cjson": "jsonc",
    "*.wxss": "css",
    "*.wxs": "javascript",
    "*.css": "tailwindcss",
  },
  "emmet.includeLanguages": {
    "wxml": "html"
  },
  "minapp-vscode.disableAutoConfig": true,
  "window.commandCenter": false,
  "vue.inlayHints.optionsWrapper": true,
  "window.zoomLevel": 1,
  "workbench.tree.enableStickyScroll": true,
  "git.replaceTagsWhenPull": true,
  "cmake.showOptionsMovedNotification": false,
  "editor.minimap.enabled": false,
  "editor.foldingMaximumRegions": 4000,
  "vue.server.hybridMode": true,
  "diffEditor.ignoreTrimWhitespace": false,
  "errorLens.enabledDiagnosticLevels": [
    "error"
  ]
}
```
