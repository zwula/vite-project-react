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
