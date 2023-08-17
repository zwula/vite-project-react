# vite-project-react

## 项目配置

### 代码规范

#### commitlint

先配置`commitlint`提交规范，因为这样的话后续配置的 代码规范 可以被 提交规范 所管控。

查阅了多篇文章，对比了多个工具之后，舍弃了commitlint/commitzen/cz-conventional-changelog等一些列工具，直接上 cz-git。 [cz-git官网](https://cz-git.qbb.sh/zh/guide/)


**全局**安装 commitizen,如此一来可以快速使用 cz 或 git cz 命令进行启动。

      npm install -g commitizen
**注意，如果使用 `pnpm install -g commitizen` 会报错，这个问题还没有解决.**

在**项目内**安装`cz-git`依赖

      pnpm install -D cz-git

修改 `package.json` 文件， 添加 `config` 指定使用的适配器

      {
         "scripts": {
            "commit": "git-cz"
         },
         "config": {
            "commitizen": {
               "path": "node_modules/cz-git"
            }
         }
      }

添加自定义配置(可选，使用默认)，根目录添加 `.commitlintrc.cjs` 文件: 

**注意：vite3.x 开始生成的项目，package.json 会自动加上 "type": "module"，这时根目录的配置文件不能以 .js 结尾，要改为 .cjs，如 .commitlintrc.cjs, .prettierrc.cjs, .eslintrc.cjs**

      // .commitlintrc.cjs
      /** @type {import('cz-git').UserConfig} */
      module.exports = {
         rules: {
            // @see: https://commitlint.js.org/#/reference-rules
         },
         prompt: {
            messages: {
               type: '选择你要提交的类型 :',
               scope: '选择一个提交范围（可选）:',
               customScope: '请输入自定义的提交范围 :',
               subject: '填写简短精炼的变更描述 :\n',
               body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
               breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
               footerPrefixesSelect: '选择关联issue前缀（可选）:',
               customFooterPrefix: '输入自定义issue前缀 :',
               footer: '列举关联issue (可选) 例如: #31, #I3244 :\n',
               confirmCommit: '是否提交或修改commit ?'
            },
            types: [
               { value: 'feat', name: 'feat:        🚀  新增功能 | A new feature' },
               { value: 'fix', name: 'fix:         🔨  修复缺陷 | A bug fix' },
               {
               value: 'docs',
               name: 'docs:        📝  文档更新 | Documentation only changes'
               },
               {
               value: 'style',
               name: 'style:       🔠  代码格式 | Changes that do not affect the meaning of the code'
               },
               {
               value: 'refactor',
               name: 'refactor:    ♻️   代码重构 | A code change that neither fixes a bug nor adds a feature'
               },
               {
               value: 'perf',
               name: 'perf:        ⚡️  性能提升 | A code change that improves performance'
               },
               {
               value: 'test',
               name: 'test:        🧪  测试相关 | Adding missing tests or correcting existing tests'
               },
               {
               value: 'build',
               name: 'build:       📦️  构建相关 | Changes that affect the build system or external dependencies'
               },
               {
               value: 'ci',
               name: 'ci:          👌  持续集成 | Changes to our CI configuration files and scripts'
               },
               { value: 'revert', name: 'revert:      ⏪️  回退代码 | Revert to a commit' },
               {
               value: 'chore',
               name: 'chore:       💡  其他修改 | Other changes that do not modify src or test files'
               }
            ],
            useEmoji: true
         }
      }

---

#### 统一包管理工具

在项目根目录新增`preinstall.js`文件，增加以下内容：

      const allowPM = 'pnpm'
      const execpath = process.env.npm_execpath || ''
      if (!new RegExp(`${allowPM}`).test(execpath)) {
         console.warn(`\u001b[33m This repository requires using ${allowPM} as the package manager for scripts to work properly.\u001b[39m\n`)
         process.exit(1)
      }

此时，我们会发现文件中出现以下报错提示：

      'process' is not defined.  eslint(no-undef) [eslint规则方面的报错提示]

合理怀疑，该报错由于eslint无法识别和 `node` 相关的变量而导致的，因此我们需要在eslint中进行相应的调整。
当我们初始化eslint后，并在第四步 `Where does your code run?`  将 `Browser` 和 `Node` 都选中，当前报错就会消失。

之后，我们在项目的`package.json`中新增一条指令`preinstall`

      "scripts": {
         // ......
         "preinstall": "node ./preinstall.js"
      },

><br/>此时当我们使用`npm`或者`yarn`来安装包的时候，就会报错了。原理就是在`install`的时候会触发`preinstall（生命周期钩子）`这个文件里面的代码。但是在 NPM v7 以后的版本中，预安装脚本在安装依赖项后运行，这破坏了我们预期的行为。可以跟踪官方issue的处理进展：https://github.com/npm/cli/issues/2660
<br/>

配置完成后，
如果我们通过 `npm install path -D` 安装依赖时，就会出现如下报错（并不会打印出文件中的内容）

      npm ERR! Cannot read properties of null (reading 'matches')

      npm ERR! A complete log of this run can be found in:
      npm ERR!     C:\Users\yuelei\AppData\Local\npm-cache\_logs\2023-08-16T15_10_50_016Z-debug-0.log

而通过 `pnpm install path -D` 安装依赖时，就可以成功安装。

综上，我们就完成了  [**统一包管理工具**](#统一包管理工具)  的项目规范配置。

---
#### 配置eslint  [-官网-](https://eslint.org/docs/latest/use/getting-started)

当我们在使用 `vite` 初始化项目时， `vite` 已经默认为我们集成了 `eslint` ，并在 `package.json` 文件中为我们配置好了相关 `scripts` 命令。

      "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",

但是我们需要根据项目实际情况进行调整，按照官网的教程，重新初始化`eslint`

      npm init @eslint/config

**注意：在初始化的第四步 `Where does your code run?`  将 `Browser` 和 `Node` 都选中，这样，eslint就可以识别和node有关的变量了，即解决了我们 `统一包管理工具` 时，遇到的 `'process' is not defined.  eslint(no-undef)` 的报错问题**

重新初始化 `eslint` 后，会有以下改变：
1、更新以下两个依赖 `@typescript-eslint/eslint-plugin` 和 `@typescript-eslint/parser`

         - @typescript-eslint/eslint-plugin 6.0.0
         + @typescript-eslint/eslint-plugin 6.3.0  更新
         - @typescript-eslint/parser 6.0.0 
         + @typescript-eslint/parser 6.3.0  更新

2、新增依赖 `eslint-plugin-react`

         + eslint-plugin-react  新增

此时，当我们查看各个文件时，会发现`App.tsx`文件中出现两条报错提示，均和新增的`eslint-plugin-react`依赖相关，说明 `eslint` 中的 `eslint-plugin-react` 已经生效:

1、'React' must be in scope when using JSX 。  eslint (react/react-in-jsx-scope)

针对报错一: 是因为在`react v17`之前的版本，在组件中需要通过`React`对`jsx`进行解析，但是在`react v17`之后，就不再需要使用`React`对jsx进行解析了。根据报错提示，我们只需要在`.eslintrc.cjs`中新增以下代码即可

      "extends": [
         // 新增如下拓展配置
         "plugin:react/jsx-runtime"
      ]

2、Using target="_blank" without rel="noreferrer" (which implies rel="noopener") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations eslint(react/jsx-no-target-blank)

针对报错二: 为a标签新增 `rel="noreferrer"` 即可解决问题

      <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>

**注意，点击报错提示中的链接部分，会跳转至对应的规则页面，我们可以根据提示理解并解决问题。**

综上，我们已经完成了 `eslint` 的重新初始化过程，并解决了因为新增依赖 `eslint-plugin-react` 引起的报错。
此时，`eslint` 已经开始生效！

---

**小问题，当我们执行`pnpm run lint`时，会弹出一个警告`Warning: React version not specified in eslint-plugin-react settings. See https://github.com/jsx-eslint/eslint-plugin-react#configuration .`,需要我们在`.eslintrc.cjs`新增如下配置内容：**

      "settings": {
         "react": {
             "version":"detect"
         }
      }

此时，在执行`pnpm run lint`就不会再出现警告。

---

与项目相关的`eslint`依赖（待补充）：
1、eslint-plugin-import ------ 该插件目的在于支持ES6以上的导入/导出语法，并防止文件路径和导入名称拼写错误的问题。

---
