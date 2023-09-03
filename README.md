# vite-project-react

### 一、代码规范

#### commitlint

先配置`commitlint`提交规范, 因为这样的话后续配置的 代码规范 可以被 提交规范 所管控。

查阅了多篇文章, 对比了多个工具之后, 舍弃了commitlint/commitzen/cz-conventional-changelog等一些列工具, 直接上 cz-git。 [cz-git官网](https://cz-git.qbb.sh/zh/guide/)

**全局**安装 commitizen,如此一来可以快速使用 cz 或 git cz 命令进行启动。

      npm install -g commitizen

**注意, 如果使用 `pnpm install -g commitizen` 会报错, 这个问题还没有解决.**

在**项目内**安装`cz-git`依赖

      pnpm install -D cz-git

修改 `package.json` 文件, 添加 `config` 指定使用的适配器

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

添加自定义配置(可选, 使用默认), 根目录添加 `.commitlintrc.cjs` 文件:

**注意：vite3.x 开始生成的项目, package.json 会自动加上 "type": "module", 这时根目录的配置文件不能以 .js 结尾, 要改为 .cjs, 如 .commitlintrc.cjs, .prettierrc.cjs, .eslintrc.cjs**

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

在项目根目录新增`preinstall.js`文件, 增加以下内容：

      const allowPM = 'pnpm'
      const execpath = process.env.npm_execpath || ''
      if (!new RegExp(`${allowPM}`).test(execpath)) {
         console.warn(`\u001b[33m This repository requires using ${allowPM} as the package manager for scripts to work properly.\u001b[39m\n`)
         process.exit(1)
      }

此时, 我们会发现文件中出现以下报错提示：

      'process' is not defined.  eslint(no-undef) [eslint规则方面的报错提示]

合理怀疑, 该报错由于eslint无法识别和 `node` 相关的变量而导致的, 因此我们需要在eslint中进行相应的调整。
当我们初始化eslint后, 并在第四步 `Where does your code run?` 将 `Browser` 和 `Node` 都选中, 当前报错就会消失。

之后, 我们在项目的`package.json`中新增一条指令`preinstall`

      "scripts": {
         // ......
         "preinstall": "node ./preinstall.js"
      },

> <br/>
> 此时当我们使用`npm`或者`yarn`来安装包的时候, 就会报错了。原理就是在`install`的时候会触发`preinstall（生命周期钩子）`这个文件里面的代码。但是在 NPM v7 以后的版本中, 预安装脚本在安装依赖项后运行, 这破坏了我们预期的行为。可以跟踪官方issue的处理进展：https://github.com/npm/cli/issues/2660 > 
> <br/>

配置完成后,
如果我们通过 `npm install path -D` 安装依赖时, 就会出现如下报错（并不会打印出文件中的内容）,虽然报错的这个行为并不是我们所预期的, 但是也确实达到了我们想要统一包管理工具的目的。

      npm ERR! Cannot read properties of null (reading 'matches')

      npm ERR! A complete log of this run can be found in:
      npm ERR!     C:\Users\yuelei\AppData\Local\npm-cache\_logs\2023-08-16T15_10_50_016Z-debug-0.log

而通过 `pnpm install path -D` 安装依赖时, 就可以成功安装。

综上, 我们就完成了 [**统一包管理工具**](#统一包管理工具) 的项目规范配置。

---

#### 配置eslint [-官网-](https://eslint.org/docs/latest/use/getting-started)

当我们在使用 `vite` 初始化项目时, `vite` 已经默认为我们集成了 `eslint` , 并在 `package.json` 文件中为我们配置好了相关 `scripts` 命令。

      "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",

但是我们需要根据项目实际情况进行调整, 按照官网的教程, 重新初始化`eslint`

      npm init @eslint/config

**注意：在初始化的第四步 `Where does your code run?` 将 `Browser` 和 `Node` 都选中, 这样, eslint就可以识别和node有关的变量了, 即解决了我们 `统一包管理工具` 时, 遇到的 `'process' is not defined.  eslint(no-undef)` 的报错问题**

重新初始化 `eslint` 后, 会有以下改变：
1、更新以下两个依赖 `@typescript-eslint/eslint-plugin` 和 `@typescript-eslint/parser`

         - @typescript-eslint/eslint-plugin 6.0.0
         + @typescript-eslint/eslint-plugin 6.3.0  更新
         - @typescript-eslint/parser 6.0.0
         + @typescript-eslint/parser 6.3.0  更新

2、新增依赖 `eslint-plugin-react`

         + eslint-plugin-react  新增

此时, 当我们查看各个文件时, 会发现`App.tsx`文件中出现两条报错提示, 均和新增的`eslint-plugin-react`依赖相关, 说明 `eslint` 中的 `eslint-plugin-react` 已经生效:

1、'React' must be in scope when using JSX 。 eslint (react/react-in-jsx-scope)

针对报错一: 是因为在`react v17`之前的版本, 在组件中需要通过`React`对`jsx`进行解析, 但是在`react v17`之后, 就不再需要使用`React`对jsx进行解析了。根据报错提示, 我们只需要在`.eslintrc.cjs`中新增以下代码即可

      "extends": [
         // 新增如下拓展配置
         "plugin:react/jsx-runtime"
      ]

2、Using target="\_blank" without rel="noreferrer" (which implies rel="noopener") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations eslint(react/jsx-no-target-blank)

针对报错二: 为a标签新增 `rel="noreferrer"` 即可解决问题

      <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>

**注意, 点击报错提示中的链接部分, 会跳转至对应的规则页面, 我们可以根据提示理解并解决问题。**

综上, 我们已经完成了 `eslint` 的重新初始化过程, 并解决了因为新增依赖 `eslint-plugin-react` 引起的报错。
此时, `eslint` 已经开始生效！

---

**小问题, 当我们执行`pnpm run lint`时, 会弹出一个警告`Warning: React version not specified in eslint-plugin-react settings. See https://github.com/jsx-eslint/eslint-plugin-react#configuration .`,需要我们在`.eslintrc.cjs`新增如下配置内容：**

      "settings": {
         "react": {
             "version":"detect"
         }
      }

此时, 在执行`pnpm run lint`就不会再出现警告。

---

与项目相关的`eslint`依赖（待补充）：
1、eslint-plugin-import ------ 该插件目的在于支持ES6以上的导入/导出语法, 并防止文件路径和导入名称拼写错误的问题。【在配置文件夹别名部分进行配置】

---

#### 配置Prettier

安装prettier

      pnpm install prettier -D

在项目根目录添加 `.prettierrc` 文件, 在文件中定义项目中所需要的规则 [官网](https://prettier.io/docs/en/options)

**prettier配置文件的名字一定必须要是`.prettierrc`, 因为vscode中的Prettier插件默认会读取项目根目录下的`.prettierrc`文件,如果读取不到, 就会按照vscode中Prettier插件对文件进行格式化**

      {
         // 你想要添加的规则...
         "singleQuote": true,
         "semi": false
      }

此时, 在以下条件下,
1、vscode安装并使用 Prettier 插件
2、设置保存时格式化当前文件

      "editor.formatOnSave": true,

3、设置编辑器默认格式化方式为prettier

      "editor.defaultFormatter": "esbenp.prettier-vscode"

此时, 当我们保存某个文件时, Prettier插件会优先读取项目根目录下的`.prettierrc`作为规则文件, 如果读取不到, 则会按照Prettier插件本身设置的拓展规则作为规则文件, 对代码进行格式化.

**但是注意, 这种方式配置的prettier, 即使出现了代码格式化的问题, 也不会以显式的方式体现出来, 并不会像eslint代码问题一样, 以warn或者error显式的反馈给开发者。而且, 这种方式配置的prettier规则和eslint的相关规则会出现冲突的问题。**

##### 解决问题一： 解决冲突

安装eslint-config-prettier [github](https://github.com/prettier/eslint-config-prettier)

      pnpm install eslint-config-prettier -D

然后, 需要`.eslintrc.*`文件中, 将`"prettier"`作为最后一个扩展添加

      {
         "extends": ["prettier"]
      }

这样, 我们就可以不必担心prettier的规则和其他拓展的规则发生冲突, 放心的在自己的 `.prettierrc` 文件中设置prettier选项, 并在保存文件时, 将配置项应用在被保存的文件中

扩展文章： [ESLint共享配置的两种方式eslint-plugin和eslint-config](https://www.codetd.com/en/article/13434662)

**注意此时, 我们解决的个prettier与其他拓展相互冲突的问题, 但是prettier生效的方式还是当我们保存文件时, 自动格式化当前文件。且代码格式化的问题, 依然不会暴露出来**

##### 解决问题二： 将格式化问题暴露出来

在这个问题上, 我们期望的是将代码格式化问题, 像`eslint`一样以 warn 或者 error 的形式显式地暴露出来, 那么我们只需要将`prettier`作为`eslint`的插件来进行使用, 就可以达到我们期望的样子。

安装eslint-plugin-prettier [github](https://github.com/prettier/eslint-plugin-prettier)

      pnpm install eslint-plugin-prettier -D

然后, 需要`.eslintrc.cjs`文件中, 增加如下配置

      {
         "plugins": ["prettier"],
         "rules": {
            "prettier/prettier": "error",
            <!-- 下面的两个选项是可能会冲突的问题 -->
            "arrow-body-style": "off",
            "prefer-arrow-callback": "off
         }
      }

**!! 注意注意 !!**
**完成上述配置后, 我们会发现组件中出现大量的报错, 报错内容可能和我们之前在`.prettierrc`文件中配置的规则冲突, 这是因为我们改变了prettier的工作方式, 我们现在把它作为eslint的插件进行使用, 此时我们在`.prettierrc`文件中配置的规则文件会和`.eslintrc.cjs`配置的规则文件同时生效, 所以, 我们必须保证两个规则文件的一致性,才可以避免冲突**

我们可以在`.eslintrc.cjs`文件的rules中, 将**prettier规则以eslint插件规则**的形式进行配置使用, 并保证和`.prettierrc`文件中配置规则保持一致, 代码如下

      rules: {
         'prettier/prettier': [
            'error',
            {
               singleQuote: true,
               endOfLine: 'auto',
               semi: false,
            },
         ],
      },

---

为了简化操作流程, 还提供了一种简化写法

同时安装 `eslint-config-prettier` `eslint-plugin-prettier`

      pnpm install eslint-config-prettier eslint-plugin-prettier -D

然后, 需要`.eslintrc.cjs`文件中, 将`"plugin:prettier/recommended"`作为最后一个扩展添加

      {
            "extends": ["plugin:prettier/recommended"]
      }

      就相当于

      {
            "extends": ["prettier"],
            "plugin":["prettier"],
            "rules": {
                  "prettier/prettier": "error",
                  "arrow-body-style": "off",
                  "prefer-arrow-callback": "off"
            }
      }

> `"extends": ["prettier"]` enables the config from `eslint-config-prettier`, which turns off some ESLint rules that conflict with Prettier.
> "`plugins": ["prettier"]` registers this plugin.
> `"prettier/prettier": "error"` turns on the rule provided by this plugin, which runs Prettier from within ESLint.
> `"arrow-body-style": "off"` and `"prefer-arrow-callback": "off"` turns off two ESLint core rules that unfortunately are problematic with this plugin – see the next section.

最后, 在rules中对 `prettier` 规则进行配置即可

      rules: {
         'prettier/prettier': [
            'error',
            {
               singleQuote: true,
               endOfLine: 'auto',
               semi: false,
               useTabs: true,
               tabWidth: 4,
            },
         ],
      },

---

#### 配置stylelint

##### 实现针对`css`的规则校验 [官网](https://stylelint.io/user-guide/get-started)

初始化stylelint

        pnpm create stylelint

执行该命令后, 该命令会自动为我们做两件事

1、下载 `stylelint` 和 `stylelint-config-standard` 两个依赖

        + "stylelint": "^15.10.2",
        + "stylelint-config-standard": "^34.0.0",

2、新建 `.stylelintrc.json` 文件并初始化配置内容

        { "extends": ["stylelint-config-standard"] }

此时, 我们会发现初始化项目时的css文件已经有报错提示

        `Expected empty line before rule (rule-empty-line-before)  Stylelint(rule-empty-line-before)`
        `Unexpected vendor-prefix "-webkit-filter" (property-no-vendor-prefix)  Stylelint(property-no-vendor-prefix)`

说明我们配置的stylelint规则校验已经开始生效。

**注意, 初始化stylelint时, 自动化命令并没有为我们配置与`stylelint`相关的`scripts`指令, 也没有为我们添加对应的忽略文件**

        # package.json

        "scripts": {
                <!-- 其他指令 -->
                "style": "stylelint **/*.{css,less}",
                "style:fix": "stylelint **/*.{css,less} --fix"
        },

配置完指令后, 我们就可以使用指令对 `css` 样式文件进行格式化。

在项目根目录新建`.stylelintignore`文件, 配置stylelint忽略项

        # .stylelintignore

        # 文件夹
        node_modules
        dist
        test
        lib

        # 其他类型文件

        # 久的不需要打包的样式库
        *.min.css

---

###### 使用`stylelint-order`规范css属性的书写顺序, 减少浏览器的重绘重排

[使用`stylelint-config-recess-order`预设时会依赖`stylelint-order`, 因此我们必须下载`stylelint-order`依赖包, 只是后期可以使用预设代替长篇大论的配置项]

安装`stylelint-order` [Github](https://github.com/hudochenkov/stylelint-order/tree/master)

        pnpm install stylelint-order -D

在`.stylelintrc.json`文件中增加以下配置内容：

        "plugins": ["stylelint-order"],
        "rules": {
                "order/order": [
                        "declarations",
                        "custom-properties",
                        "at-variables",
                        "less-mixins",
                        "rules",
                        "at-rules"
                ],
                "order/properties-order": [
                        "position",
                        "z-index",
                        "top",
                        "bottom",
                        "left",
                        "right",
                        ...
                        ...
                        ...
                        <!-- 好几百条css书写顺序规则, 使得配置文件非常的多 -->
                ]
    }

###### 使用`stylelint-config-recess-order`预设

它是由社区提供的属性排序的规则, 简化了我们使用`"stylelint-order"`时配置上百条css书写顺序的困扰

安装 `stylelint-config-recess-order`

        pnpm install stylelint-config-recess-order -D

使用
在 `.stylelintrc.json` 中增加stylelint-config-recess-order作为扩展项

      {
            "extends": [
                "stylelint-config-standard",
                "stylelint-config-recess-order"
            ],
            "plugins": ["stylelint-order"],
             <!-- 删除之前长篇大论的配置项 -->
            "rules": {}
      }

此时, 我们已经实现了通过`styleleint`针对css的规则校验

---

##### 实现针对`less`的规则校验

###### 实现vite识别`.less`文件

默认情况下, vite是不能识别`.less`文件的, 我们需要先让vite可以识别`.less`文件

我们将初始化项目时的`App.css`修改为`App.less`, 并在`App.ts`中修改引入的文件为`import './App.less'`
此时, 会有报错提示

        Preprocessor dependency "less" not found. Did you install it?

按照操作提示安装`less`

         pnpm install less -D

安装完成后, 重新执行`pnpm run dev`,我们发现报错提示消失不见了, 此时vite就可以识别`.less`文件。

此时, 我们已经完成了实现vite识别`.less`文件

---

但是, 此时我们配置的stylelint并不知道如何处理`.less`文件,并且也不能识别less的相关语法, 因为我们当时只针对css做了stylelint配置。
所以, 当我们使用`pnpm run style` 或者 `pnpm run style：fix`时, 会弹出以下报错：

        D:\wilson\vite-project-react\src\App.less: you should use the "customSyntax" option when linting something other than CSS

        src/App.less
        1:1 ✖ Unexpected unknown at-rule "@color:"

解决办法参考[官网](https://stylelint.io/migration-guide/to-14/)后, 我们需要进行以下改变：

1、告知stylelint如何处理less文件

下载处理less文件的依赖 `postcss-less`

        pnpm install postcss-less -D

在`.stylelinrc.json`配置针对`.less`文件的处理方式

      "overrides": [
            {
                "files": ["*.less", "**/*.less"],
                "customSyntax": "postcss-less"
            }
      ]

配置完成后, 我们发现上述报错就消失了。
此时, stylelint已经知道如何处理`.less`文件, 并且识别相关的less语法。

2、为stylelint补充less的相关规则

安装并使用`stylelint-less`作为less语法规则的配置标准

> </br>Stylelint supports less syntax, but some of the rules in stylelint not working as expected , So created this plugin to supports those rules for less, since Stylelint is generally focused on standard CSS syntax.
> </br>

        pnpm install stylelint-less -D

在`.stylelinrc.json`配置中增加此依赖

        "plugins": [
                /*...其他插件*/
                "stylelint-less"
        ]

至此, 我们就完成了stylelint的所有配置工作！

**注意, 由于我们在项目中使用了postCSS作为样式文件的预处理器, postCSS会自动为某些属性添加不同浏览器厂商的属性前缀、属性值等等, 这个操作是非常必要的, 但是会和我们配置好的stylelint中的某些规则发生冲突**

      rules: {
            "at-rule-no-vendor-prefix": true,
            "selector-no-vendor-prefix": true,
            "property-no-vendor-prefix": true,
            "value-no-vendor-prefix": true
      }

此时, 我们需要将其进行修改

      rules: {
            // 保留动画名称前可以加浏览器前缀  如@-webkit-keyframes bounce
            "at-rule-no-vendor-prefix": null,
            // 保留各大浏览器不兼容的选择器前缀,      input::-webkit-input-placeholder
            "selector-no-vendor-prefix": null,
            // 保留各大浏览器不兼容的样式属性名前缀,  如 -moz-user-select: auto
            "property-no-vendor-prefix": null,
            // 保留各大浏览器不兼容的样式属性值前缀, display: -webkit-box;
            "value-no-vendor-prefix": null
      }

---

#### 配置husky

根据husky官网进行husky的初始化 [官网](https://typicode.github.io/husky/getting-started.html)

自动化初始化

        pnpm dlx husky-init

> <br/>It will:
> 1、Add prepare script to package.json
> 2、Create a sample pre-commit hook that you can edit (by default, npm test will run when you commit)
> 3、Configure Git hooks path
> <br/>

执行完该命令后, 该命令会自动在项目根目录新建一个`.husky`的文件夹,目录结构如下

        .husky
            _ （以_命名的文件夹）
               .gitignore
                husky.sh
            pre-commit

并且自动在`package.json`文件中, 新增一条`scripts`指令

        "scripts": {
                //  else ...·
                "prepare": "husky install"
        }

**注意, 执行完第一步的命令后, 我们还需要再执行以下代码才可以完全完成husky的初始化工作**

        pnpm install

之后, 我们就可以在`pre-commit`的hooks钩子中, 配置相关想要执行的代码, 例如格式化代码后再提交commit等等

        #!/usr/bin/env sh
        . "$(dirname -- "$0")/_/husky.sh"

        npm run lint:fix
        npm run style:fix
        <!-- 格式化代码后, 将自动格式化代码后的文件添加到暂存库, 随着本次提交一起commit, 但是会产生一个问题, 就是连带其他不想被提交的文件也会一起被提交进去 因此不建议添加 -->
        // git add .

至此, 我们已经完成了`husky`的相关配置。

---

##### 使用`lint-staged`优化`husky`的使用

当我们完成了上述对`husky`的配置后, 每次commit提交代码之前都会按照对应的规则, 对`整个项目文件中的所有文件`进行格式化校验, 这个并不是我们所期望的。我们期望的是, 当我们执行commit的时候, 只对添加到暂存库的文件进行格式化校验。此时, 就需要使用lint-staged配合husky一起使用, 这样就可以实现我们只想针对暂存区文件进行格式化校验的目的了。

安装lint-staged

        pnpm install lint-staged -D

在`package.json`文件中, 配置`lint-staged`配置项

        "lint-staged": {
                "*.{js,jsx,cjs,ts,tsx}": [
                        "eslint --fix"
                ],
                "*.{css,less}": [
                        "stylelint --fix"
                ]
        },

完成`lint-staged`配置项的配置后, 我们就可以搭配`husky`一起使用, 达到我们之前的预期效果。

在`.husky/pre-commit`中修改代码为

        #!/usr/bin/env sh
        . "$(dirname -- "$0")/_/husky.sh"
        <!-- 只需要改这一行代码 -->
        npx lint-staged

以上, 我们就完成了使用`lint-staged`优化`husky`的使用

#### 配置husky

根据husky官网进行husky的初始化 [官网](https://typicode.github.io/husky/getting-started.html)

自动化初始化

        pnpm dlx husky-init

> <br/>It will:
> 1、Add prepare script to package.json
> 2、Create a sample pre-commit hook that you can edit (by default, npm test will run when you commit)
> 3、Configure Git hooks path
> <br/>

执行完该命令后, 该命令会在项目根目录新建一个`.husky`的文件夹,目录结构如下

        .husky
            _ （以_命名的文件夹）
               .gitignore
                husky.sh
            pre-commit

并且在`package.json`文件中, 新增一条`scripts`指令

        "scripts": {
                //  else ...·
                "prepare": "husky install"
        }

**注意, 执行完第一步的命令后, 我们还需要再执行以下代码才可以完全完成husky的初始化工作**

        pnpm install

之后, 我们就可以在`pre-commit`的hooks钩子中, 配置相关想要执行的代码, 例如格式化代码后再提交commit等等

        #!/usr/bin/env sh
        . "$(dirname -- "$0")/_/husky.sh"

        npm run lint:fix
        npm run style:fix
        <!-- 格式化代码后, 将自动格式化代码后的文件添加到暂存库, 随着本次提交一起commit, 但是会产生一个问题, 就是连带其他不想被提交的文件也会一起被提交进去 因此不建议添加 -->
        // git add .

至此, 我们已经完成了`husky`的相关配置。

---

##### 使用`lint-staged`优化`husky`的使用

当我们完成了上述对`husky`的配置后, 每次commit提交代码之前都会按照对应的规则, 对`整个项目文件中的所有文件`进行格式化校验, 这个并不是我们所期望的。我们期望的是, 当我们执行commit的时候, 只对添加到暂存库的文件进行格式化校验。此时, 就需要使用lint-staged配合husky一起使用, 这样就可以实现我们只想针对暂存区文件进行格式化校验的目的了。

安装lint-staged

        pnpm install lint-staged -D

在`package.json`文件中, 配置`lint-staged`配置项

        "lint-staged": {
                "*.{js,jsx,cjs,ts,tsx}": [
                        "eslint --fix"
                ],
                "*.{css,less}": [
                        "stylelint --fix"
                ]
        },

完成`lint-staged`配置项的配置后, 我们就可以搭配`husky`一起使用, 达到我们之前的预期效果。

在`.husky/pre-commit`中修改代码为

        #!/usr/bin/env sh
        . "$(dirname -- "$0")/_/husky.sh"
        <!-- 只需要改这一行代码 -->
        npx lint-staged

以上, 我们就完成了使用`lint-staged`优化`husky`的使用

---

---

---

### 二、项目开发配置

#### 1. 文件别名的配置

文件别名的配置主要从以下两方面进行,

1、打包时, 对于文件夹别名的处理,打包过程中如果不知道 @ 代表那个文件夹, 则会直接报错。
2、编译时, 对于文件夹别名的处理

##### 1.1 针对vite打包时, 文件夹别名的处理

首先需要先安装path模块,

        pnpm install path -D

安装完成后, 在项目根目录, `vite.config.ts`文件的配置项中, 配置与文件夹别名有关的`resolve`配置项

        import { defineConfig } from 'vite'
        import react from '@vitejs/plugin-react'
        ++ import path from 'path'

        // https://vitejs.dev/config/
        export default defineConfig({
                plugins: [react()],
                ++  resolve: {
                ++          alias: {
                ++                  '@': path.resolve(__dirname, './src'),
                ++                  <!-- 根据需要再自行进行配置 -->
                ++                  '@xxx': path.resolve(__dirname, './src/xxx'),
                ++          },
                ++  },
        })

**注意, 当我们增加如下配置后, 会报错提示 `找不到名称"__dirname"` , 这是因为 `path` 模块是 `node.js` 的内置模块, 而 `node.js` 默认是不支持 `ts` 文件的, 此时我们安装针对 `node` 的ts依赖包 `@types/node` 即可**

        pnpm install @types/node -D

这样, 我们就告知了`vite`相关文件夹别名的信息, 这样就不会在打包的过程中报错, 提示与文件夹别名有关的错误了。

##### 1.2 针对编译时, 文件夹别名的处理

主要从以下两个方面进行处理：
1、针对ts的编译提示
2、针对插件的编译检查
是否使用了针对导出/引入检查的插件, 如果有, 那么则需要针对插件的编译检查进行相关的配置（因此大部分情况下, 这些插件默认是不支持文件夹别名的）

###### 1.2.1 针对ts的编译提示（主要配置的是ts的提示）

`ts` 默认是不支持文件夹别名的, 但是注意, 当你在 `ts文件` 中使用文件夹别名, 例如 `"@"`, ts是不会有报错提示的, 它只是不会提示`"@"`中的内容了, 例如, 当我们输入`"@"`时, ts不会提示任何和文件夹相关的信息, 如 `"@/components/ComponentA..."`, 因为它不知道 `"@"` 表示什么, 为了使`ts`可以为更好的提示`"@"`中的内容, 我们需要针对 `针对ts的编译提示` 进行相关的配置

在项目根目录的`tsconfig.json`中的`compilerOptions配置项`增加以下配置：

        "compilerOptions": {
                /* alias */
                <!-- 定义文件与文件查找的基本关系 -->
                "baseUrl": "./",
                <!-- 路径映射, 此处是结合baseUrl使用的, 还可根据项目需要自行配置提示关系 -->
                "paths": {
                        "@/*":["src/*"]
                }
        },

配置完成后, 当我们输入`"@"`时, ts就会将`"@"`提示为`src`文件夹, 嘎嘎好使！

###### 1.2.2 针对插件的编译检查

扩展：eslint部分
我们配置 `eslint-plugin-import` 这个插件, 这个插件支持ES2015+（ES6+）导入/导出语法的覆盖, 并防止文件路径和导入名称的拼写问题。

但是这个插件, 其默认是不支持文件夹别名的, 当其遇到文件夹别名的时候, 不知道要如何进行处理, 因此我们需要 `针对插件的编译检查` 进行相关的配置

安装 `eslint-plugin-import` 依赖 [官网](https://www.npmjs.com/package/eslint-plugin-import)

        pnpm install eslint-plugin-import -D

在 `.eslintrc.cjs` 文件中增加如下配置

        extends: [
                <!-- 新增'plugin:import/recommended' -->
                'plugin:import/recommended',
        ],

这个时候我们会发现, 初始化项目的App.tsx中提示关于文件引入的报错提示。

        Unable to resolve path to module '@/App.less'.eslint (import/no-unresolved)
        Unable to resolve path to module '/vite.svg'.eslint (import/no-unresolved)

可以看出, 该插件默认不支持根路径 `"/"` 和文件夹别名 `"@"` , 因此需要我们进行配置调整, 解决这两个问题。

###### 针对 `Unable to resolve path to module '@/App.less'.eslint (import/no-unresolved)` 不识别文件夹别名的情况

参考官网, 安装 `eslint-import-resolver-typescript`, 并进行相应的配置。

安装 `eslint-import-resolver-typescript`

        pnpm install eslint-import-resolver-typescript -D

在 `.eslintrc.cjs` 文件中增加如下配置

        extends: [
                <!-- 新增'plugin:import/recommended' -->
                'plugin:import/recommended',
                'plugin:import/typescript',
        ],

        ... ... 其他配置项

        settings: {
                'import/resolver': {
                        typescript: true,    // this loads <rootdir>/tsconfig.json to eslint
                        node:true
                },
        },

增加以上配置后, 会读取当前项目根目录的`tsconfig.json`中的配置内容来处理对应的文件关系.

**但是当我们增加了以上配置后, 会发现main.tsx中提示报错 `No default export found in imported module "react-dom/client".eslint (import/default)`, 但是我们在react项目中经常要使用`import react, {useState} from "react"`或者`import ReactDOM from 'react-dom/client'`这种写法, 因此我们需要取消这条eslint规则的提示报错**

        rules: {
                'import/default': 0,  // 关闭检测默认导出
                'import/no-absolute-path': 0,  // 关闭禁止使用绝对路径导入模块
        }

###### 针对 `Unable to resolve path to module '/vite.svg'.eslint (import/no-unresolved)` 不识别绝对路径的情况

【暂时没找到合适的解决方法, 先避免这种写法】

---

#### 配置环境变量

[参考文章](https://it.zsyts.cn/155598.html)
在项目开发中, 我们至少会经历开发环境、测试环境和生产环境三个阶段, 每个阶段请求的状态不尽相同, 若手动切换接口地址是相当繁琐且容易出错, 于是配置环境变量的需求应运而生, 我们只需要提前配置好不同环境所需要的状态, 把环境改变时, 状态切换的工作交给vite即可。

##### 1. 整合文件目录

通过`vite.config.ts`中的`envDir`配置环境变量的目录, 将他们整合在一起。

        envDir: 'env',  // env为目录名

在项目根目录下, 创建`env`文件夹, 在该文件夹中组织不同环境下的环境变量文件

##### 2. 配置不同环境下的环境变量文件

默认情况下

        npm run dev --> 会加载 .env 和 .env.development 内的配置
        npm run build --> 会加载 .env 和 .env.production 内的配置

**在浏览器环境中**
加载的环境变量会通过 import.meta.env 以字符串形式暴露给客户端源码。
为了防止意外地将一些环境变量泄漏到客户端, 只有以 `"VITE_"` 为前缀的变量才会暴露给经过 vite 处理的代码。

通过 `import.meta.env` 获取到的环境变量, 主要包括以下两种类型：

1.  vite内置的环境变量

        vite内置了5个环境变量, 分别为：

                BASE_URL --> 通过`vite.config.ts`文件中`base`配置项进行配置修改 **不要修改**
                DEV --> boolean, 表示当前环境是否是DEV环境
                PROD --> boolean, 表示当前环境是否是PROD环境
                SSR --> boolean, 表示当前环境是否是SSR环境
                MODE --> string,  表示当前mode值

2.  自定义的环境变量

        VITE_XXXX_XXXX --> 只有以 `"VITE_"` 为前缀的变量才会暴露给经过 vite 处理的代码。

3.  对于自定义的环境变量`VITE_XXXX_XXXX`,ts默认不会进行提示, 需要我们去定义相关的接口

    新建`src/typings`文件夹, 在该文件中新建`env.d.ts`, 并新增如下接口内容

        interface ImportMetaEnv {
                VITE_API_BASE_URL: string
        }

当我们运行 `pnpm run dev` 时, mode属于development, 因此.env和 .env.development中以VITE\_ 为前缀的变量都会被识别。

当然, 我们也可以通过`--mode`自定义环境, 并读取当前自定义环境的环境变量, 具体可以参考上面给出的参考网址。

**注意**
**process.env是Nodejs提供的一个API, 其返回一个对象, 包含了当前Shell的所有环境变量, 只能在node环境进行访问。**

但是在vite构建的项目中, 业务代码是运行在浏览器环境中的, 是不能识别`process.env`的, 因此在业务代码中才需要通过使用`import.meta.env`获取当前环境的环境对象中的环境变量。而vite的配置文件(`vite.config.ts`), 则是运行在node环境中的, 是可以识别 `process.env` 的, 因此在`vite.config.ts`中, 可以直接通过`process.env`获取当前环境的环境对象中的环境变量。

#### 配置`less`全局变量和mixin

在`src/assets`文件夹下, 新建一个`global.less`文件, 作为项目`less`样式文件的 全局变量 和 全局mixin 入口：

该文件主要的作用是：

1. 定义可以全局使用的less变量variable
2. 定义可以全局使用的less混入mixin

为了更直观的组织代码, 我们将global.less按照作用拆分为三个文件 `variable.less` 、`mixin.less` , 并最终交由`global.less`文件统一管理

新建`variable.less`文件 全局的less变量文件
新建`mixin.less`文件 全局的less样式mixin文件

交由`global.less`统一管理

        /*
        ** 全局的样式文件
        ** 1、variable - 定义全局css 变量
        ** 2、mixin - 定义全局css mixin混入
        */

        @import '@/assets/styles/variable.less';
        @import '@/assets/styles/mixin.less';

**注意** 当我们使用 `@import '@/assets/styles/variable.less';`这种写法时, stylelint会报错提示

        Expected "'@/assets/styles/variable.less'" to be "url('@/assets/styles/variable.less')" (import-notation)Stylelintimport-notation

意思是默认情况下, 更推荐使用 `@import url("@/assets/styles/variable.less")`这种url的写法, 但是在项目中, 更常用的是string的写法, 因此我们可以在`.stylelintrc.json`进行如下的配置更改, 解决这个报错提示。

        "rules": {
                <!-- 其他rules -->
                "import-notation": "string"
        }

最后, 我们将`global.less`文件作为全局的less文件进行使用, 在`vite.config.ts`中, 增加对样式文件的配置：

        css: {
                preprocessorOptions: {
                        less: {
                                // 引入全局变量, 注意最后的;一定要带
                                additionalData: `@import "@/assets/styles/global.less";`,
                        },
                },
        },

这样, 我们就可以在业务代码中直接使用全局定义的变量和mixin。

#### 配置`reset.less`重置浏览器样式

在`src/assets/styles`新增`reset.less`文件。[具体样式参考这篇文章](https://blog.csdn.net/chaoPerson/article/details/130796513)

        html,
        body {
                height: 100%;

                /* 文字风格 Sans-serif 各笔画粗细相同, Serif 笔画粗细不同, monospace 等宽体, cursive草书, fantasy梦幻 */
                font-family: 'Microsoft YaHei', sans-serif, 'Helvetica Neue', Helvetica,
                        Arial, '黑体', '宋体';
                -webkit-tap-highlight-color: transparent;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
        }

        body {
                font-size: 14px;
                color: #333;
        }

        /* 重置各标签的默认样式 */
        a,
        body,
        center,
        cite,
        code,
        dd,
        del,
        div,
        dl,
        dt,
        em,
        fieldset,
        figcaption,
        figure,
        footer,
        form,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        header,
        hr,
        html,
        img,
        input,
        label,
        legend,
        li,
        mark,
        ol,
        p,
        section,
        span,
        textarea,
        time,
        td,
        th,
        ul {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
                font-style: normal;

                /*  强制英文单词断行 */
                word-break: break-all;

                /*  自动换行 */
                word-wrap: break-word;
                border: 0;
        }

        /*  设置标签为块级分类 */
        article,
        aside,
        details,
        fieldset,
        figcaption,
        figure,
        footer,
        header,
        main,
        nav,
        section {
                display: block;
        }

        /* 去除input标签的默认样式 */
        button,
        input,
        textarea {
                padding: 0;
                margin: 0;
                font-family: 'Microsoft YaHei', sans-serif, 'Helvetica Neue', Helvetica,
                        Arial, '黑体', '宋体';
                font-size: 1em;
                line-height: 1em;
                -webkit-appearance: none;
                background-color: transparent;
                border: 0;
                outline: none;
        }

        /*  禁止多文本框手动拖动大小 */
        textarea {
                -webkit-appearance: none;
                resize: none;
        }

        /* 去掉按下的阴影盒子 */
        input,
        textarea,
        a {
                -webkit-tap-highlight-color: transparent;
        }

        /*  清除a标签下划线 */
        a,
        a:visited {
                text-decoration: none;
        }

        a:focus,
        a:active,
        a:hover {
                outline: none;
        }

        /*  清除列表前面的点 */
        ol,
        li,
        ul {
                list-style: none;
        }

        /*  清除IE下图片的边框 */
        img {
                font-size: 0;
                border-style: none;
        }

        /*  解决chrome浏览器默认黄色背景问题 */
        input:-webkit-autofill,
        textarea:-webkit-autofill,
        select:-webkit-autofill {
                -webkit-box-shadow: 0 0 0 1000px #fff inset;
        }

        /*  设置默认滚动条样式 */
        ::-webkit-input-placeholder {
                color: #afbdcc;
        }

        :-moz-placeholder {
                color: #afbdcc;
        }

        ::-moz-placeholder {
                color: #afbdcc;
        }

        :-ms-input-placeholder {
                color: #afbdcc;
        }

        ::-webkit-scrollbar {
                width: 6px;
                height: 6px;
        }

        ::-webkit-scrollbar-track {
                background-color: #f5f5f5;
        }

        ::-webkit-scrollbar-track-piece {
                background-color: #f5f5f5;
                border-radius: 6px;
        }

        ::-webkit-scrollbar-thumb {
                background-color: #ccc;
                border-radius: 6px;
        }

        ::-webkit-scrollbar-corner {
                background-color: #f5f5f5;
        }

        ::-webkit-resizer {
                background-repeat: no-repeat;
                background-position: bottom right;
        }

在入口文件`main.ts`中, 引入`reset.less`文件

        import '@/assets/styles/reset.less'

#### 配置项目中使用svg图标 [官网](https://github.com/vbenjs/vite-plugin-svg-icons/tree/main#readme)

##### 1. 配置`vite-plugin-svg-icons`

安装 `vite-plugin-svg-icons`

        pnpm install vite-plugin-svg-icons -D

在 `vite.config.ts` 配置插件的使用

        import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
        import path from 'path'

        export default () => {
                return {
                        plugins: [
                                createSvgIconsPlugin({
                                        // Specify the icon folder to be cached
                                        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
                                        // Specify symbolId format
                                        symbolId: 'icon-[dir]-[name]',
                                }),
                        ],
                }
        }

在入口文件 `main.tsx` 中导入

        import 'virtual:svg-icons-register'

##### 2. 在项目中使用svg图标

###### 2.1 创建SVG图标

首先, 在图标库网站或者某个图标的svg代码, 此处以iconfont为例, 登录[iconfont官网](https://www.iconfont.cn/collections/detail?spm=a313x.collections_index.i1.d9df05512.c1923a81EV2wf1&cid=45549), 选择某个图标(例：delete), 点击下载, 选择`"复制SVG代码"`。

然后, 在当前项目 `src/assets` 文件夹中, 新建 `icons` 文件夹, 在新建的 `icons` 文件夹创建 `***.svg` SVG图标文件(例：delete.svg), 然后将刚才复制的SVG代码粘贴到这个svg文件中, 这样我们就创建了一个SVG图标(例：delete.svg)。

###### 2.2 在组件中使用SVG图标（以新建的delete.svg为例）

在需要展示SVG图标的组件中, 使用之前创建的svg图标

        <svg style={{width:"24px",height:"24px"}}>
                <use href="#icon-delete" fill="red"></use>
        </svg>

我们发现这样使用起来及其不方便, 我们可以将其封装为`SvgIcon`组件以方便在组件中进行使用。

###### 2.3 封装SvgIcon组件

**封装组件前的准备**

统一组件封装的写法, 更方便进行规范话的开发, 主要参考了这篇文件[链接](https://juejin.cn/post/7195948584855945272)

**以下是文章中, 为了统一组件封装的写法, 所需要的工具函数文件, 这里留存一份作为备份**

需要提前下载 `classnames` 这个依赖库

        pnpm install classnames -D

`src/utils/native-props.ts`

        # utils/native-props.ts

        import classNames from 'classnames'
        import type { CSSProperties, ReactElement } from 'react'
        import { cloneElement } from 'react'

        export type NativeProps<S extends string = never> = {
                className?: string
                style?: CSSProperties & Partial<Record<S, string>>
        }

        export function withNativeProps<P extends NativeProps>(
                props: P,
                element: ReactElement,
        ) {
                const p = {
                        ...element.props,
                }
                if (props.className) {
                        p.className = classNames(element.props.className, props.className)
                }
                if (props.style) {
                        p.style = {
                                ...p.style,
                                ...props.style,
                        }
                }
                return cloneElement(element, p)
        }

`src/utils/omit.ts`

        #utils/omit.ts

        /** 删除一个对象中的key */
        export default function omit<T extends object, K extends keyof T>(
                obj: T,
                keys: Array<K | string>, // string 为了某些没有声明的属性被omit
        ): Omit<T, K> {
                const clone = {
                        ...obj,
                }
                keys.forEach((key) => {
                        if ((key as K) in clone) {
                                delete clone[key as K]
                        }
                })
                return clone
        }

`src/hooks/use-merge-props.ts`

        import { useMemo } from 'react'
        import omit from '@/utils/omit'

        export type MergePropsOptions = {
                _ignorePropsFromGlobal?: boolean
        }

        /** 将某些属性变为必选 */
        type RequireKey<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: T[P] }

        export default function useMergeProps<PropsType, K extends keyof PropsType>(
                componentProps: PropsType & MergePropsOptions,
                defaultProps: Partial<PropsType>,
                globalComponentConfig: Partial<PropsType> = {},
        ): RequireKey<PropsType, K> {
                const { _ignorePropsFromGlobal } = componentProps
                const _defaultProps = useMemo(() => {
                        return {
                                ...defaultProps,
                                ...(_ignorePropsFromGlobal ? {} : globalComponentConfig),
                        }
                }, [defaultProps, globalComponentConfig, _ignorePropsFromGlobal])

                const props = useMemo(() => {
                        const mProps = omit(componentProps, [
                                '_ignorePropsFromGlobal',
                        ]) as PropsType

                        for (const propName in _defaultProps) {
                                if (mProps[propName] === undefined) {
                                        mProps[propName] = _defaultProps[propName]!
                                }
                        }

                        return mProps
                }, [componentProps, _defaultProps])

                return props as RequireKey<PropsType, K>
        }

配置用户代码片段

\*\*.tsx部分

        "create typescript react component": {
                "prefix": "ctrc",
                "body": [
                        "import React, { useState, useEffect } from 'react';",
                        "import { NativeProps, withNativeProps } from '@/utils/native-props;",
                        "import useMergeProps from '@/hooks/use-merge-props';",
                        "import './index.less';",
                        "",
                        "const classPrefix = `com${2}-${1}`;",
                        "",
                        "export type ${1}Props = { ",
                        "",
                        "} & NativeProps",
                        "",
                        "const defaultProps = {",
                        "  ",
                        "}",
                        "type RequireType = keyof typeof defaultProps",
                        "",
                        "const ${1} = (comProps: ${1}Props) => {",
                        "  const props = useMergeProps<${1}Props, RequireType>(comProps, defaultProps)",
                        "  const { ...ret } = props",
                        "  ",
                        "  return withNativeProps(",
                        "    ret,",
                        "    <div className={classPrefix}>",
                        "      ",
                        "    </div>",
                        "  )",
                        "}",
                        "",
                        "export default ${1}"
                ],
                "description": "create ts reactIframe component"
        },

至此, 封装组件前的准备工作就已经完成了, 接下来就可以封装SvgIcon组件了

以SvgIcon组件的封装为例, 实践一下 `统一组件封装的写法`

        import React from 'react'
        import { NativeProps, withNativeProps } from '@/utils/native-props'
        import useMergeProps from '@/hooks/use-merge-props'

        const classPrefix = `com-SvgIcon`

        export type SvgIconProps = {
                color?: string
                iconPrefix?: string
                icon: string
                width?: string
                height?: string
        } & NativeProps

        const defaultProps = {
                color: '',
                iconPrefix: '#icon-',
                icon: '',
                width: '16px',
                height: '16px',
        }
        type RequireType = keyof typeof defaultProps

        const SvgIcon: React.FC<SvgIconProps> = (comProps: SvgIconProps) => {
                const props = useMergeProps<SvgIconProps, RequireType>(
                        comProps,
                        defaultProps,
                )
                const { ...ret } = props

                return withNativeProps(
                        ret,
                        <div className={classPrefix}>
                                <svg style={{ width: props.width, height: props.height }}>
                                        <use
                                                href={props.iconPrefix + props.icon}
                                                fill={props.color}
                                        ></use>
                                </svg>
                        </div>,
                )
        }

        export default SvgIcon

封装完成后, 我们就可以更方便的给项目中添加SVG图标

        import SvgIcon from './components/svg-icon'
        ...
        ...
        <SvgIcon icon='delete'></SvgIcon>
        <SvgIcon icon='clock'></SvgIcon>
        <SvgIcon icon='alipay'></SvgIcon>

**如果添加了新的SVG图标不显示的话, 重新 `pnpm run dev` 编译一下项目即可**

#### 配置MockJs

##### 1. 基本配置

安装 `mockjs` 和 **`vite-plugin-mock@2.9.6`** 依赖

        pnpm install mockjs
        pnpm install vite-plugin-mock@2.9.6 -D

在 `vite.config.json` 中增加以下配置内容

        import { UserConfigExport, ConfigEnv } from 'vite'
        import { viteMockServe } from 'vite-plugin-mock'

        <!-- 注意, 写法已经不一样了 -->
        export default ({ command }: ConfigEnv): UserConfigExport => {
                return {
                        plugins: [
                                // ... ... 其他配置项
                                viteMockServe({
                                        // default
                                       localEnabled: command === 'serve', // 保证开发阶段可以使用mock, 生产环境禁止开启
                                }),
                        ],
                }
        }

##### 2. 创建接口

在项目根目录下新建 `mock` 文件夹, 并在文件夹中新建 `user.ts` 文件, 增加以下内容

        import { MockMethod } from "vite-plugin-mock"

        const createUsers = () => {
                return [
                        {
                                id: 1,
                                username: "admin",
                                password: "admin123",
                                avatar: "",
                                desc: "平台管理员",
                                roles: ["平台管理员"],
                                buttons: ["cuser.detail"],
                                routes: ["home"],
                                token: "admin token",
                        },
                        {
                                id: 2,
                                username: "system",
                                password: "system123",
                                avatar: "",
                                desc: "系统管理员",
                                roles: ["系统管理员"],
                                buttons: ["cuser.detail", "cuser.user"],
                                routes: ["home"],
                                token: "system token",
                        },
                ]
        }

        export default [
                {
                        url: "/api/login",
                        method: "post",
                        response: ({ body }) => {
                                const { username, password } = body
                                const checkUser = createUsers().find((user) => {
                                        return user.username === username && user.password === password
                                })
                                if (!checkUser) {
                                        return {
                                                status: 201,
                                                msg: "用户名或密码不正确",
                                        }
                                }
                                return {
                                        status: 200,
                                        data: {
                                                token: checkUser.token,
                                        },
                                }
                        },
                },
        ] as MockMethod[]

相当于我们定义了一个 `"/api/user/login"` 接口, 访问该接口会执行对应的逻辑函数, 并返回其结果。

##### 3. 测试`mockjs`

安装 `axios` 依赖

        pnpm install axios

在 `App.tsx` 中增加以下代码, 请求我们创建的 `"/api/user/login"` 业务接口, 打印返回结果

        import axios from "axios"

        useEffect(() => {
                // 测试axios
                axios
                .post("/api/user/login", { username: "admin", password: "admin123" })
                .then((res) => {
                        console.log("🔥 >> file: App.tsx:14 >> axios.post >> res:", res)
                })
        }, [])

发现已经可以正常的请求模拟的接口并获取返回的数据, 说明我们的 `mockjs` 已经配置成功。

#### 配置Axios, 使用ts进行二次封装

主要是对axios添加请求拦截器和相应拦截器, 主要目的有两个：

1. 请求拦截器： 携带token等服务器要求携带的统一的信息
2. 相应拦截器： 对响应的结果进行加工处理, 并对请求过程中可能出现的错误进行统一的错误处理

在 `src/utils` 中新建 `request.ts` 文件, 我们在这个文件中对axios进行二次封装, 以达到我们想要的期望:

        import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

        class Request {
                baseRequest: AxiosInstance
                defaultConfig: AxiosRequestConfig = {
                        baseURL: import.meta.env.VITE_API_BASE_URL,
                        timeout: 1000,
                }

                constructor(config: AxiosRequestConfig) {
                        config = { ...this.defaultConfig, ...config }
                        this.baseRequest = axios.create(config)

                        // 请求拦截器
                        this.baseRequest.interceptors.request.use((config) => {
                                // 统一携带请求信息
                                return config
                        })

                        // 响应拦截器
                        this.baseRequest.interceptors.response.use(
                                (rawResponse) => {
                                        /*
                                                当axios与服务器建立通信成功之后, 会进入第一个响应拦截器onFullfilled中,但是这个数据仅仅表示和服务器成功通信, 接收到了服务器返回的结果, 并不一定是我们想要的业务逻辑数据, 需要我们进行判断
                                                1.如果接受到的数据, 确实是我们需要的业务数据
                                                        此时, 我们进入正常的业务逻辑的书写, 返回处理后的数据
                                                        return processedResponse
                                                2.如果接受到的数据, 并不是我们需要的业务数据
                                                        此时, 我们需要进行错误处理, 为了实现错误的统一处理, 我们需要将其交给下一个响应拦截器, 与网络层面的错误一并进行错误的统一处理。
                                                        return Promise.reject(processedResponse)
                                        */
                                        return rawResponse
                                },
                                (rawError) => {
                                        /*
                                                当axios与服务器建立通信失败之后, 会进入第一个响应拦截器onRejected中,error表示网络层面的错误, 例如：
                                                1. 超时
                                                2. 请求的地址不存在, 404 not found


                                                对于这些网络层面的错误, 我们不做任何处理, 直接传递给下一个响应拦截器, 和业务逻辑层面的错误一起进行处理。
                                                注意： 如果想要传递给下一个拦截器的onRejectd中, 就必须返回Promise.reject(error)
                                        */
                                        return Promise.reject(rawError)
                                },
                        )
                        // 响应拦截器 - 统一的错误处理
                        this.baseRequest.interceptors.response.use(
                                (processedResponse) => {
                                        /* 直接返回从第一个响应拦截器接受到的处理后的结果 response , 什么都不需要做 */
                                        return processedResponse
                                },
                                (processedError) => {
                                        console.log('interceptors2-rejected')
                                        /*
                                                第二个响应拦截器onRejected中,会接受到两种类型的错误：
                                                1. 从第一个响应拦截器中onRejected中, 传递过来的网络层面的错误
                                                2. 从第一个响应拦截器中onFullfilled中, 传递过来的业务逻辑层面的错误

                                                我们将在这里对这些错误进行统一处理
                                        */
                                        return processedError
                                },
                        )
                }

                public get(url: string, config?: AxiosRequestConfig) {
                        return this.baseRequest.get(url, config)
                }
                public post(url: string, data?: unknown, config?: AxiosRequestConfig) {
                        return this.baseRequest.post(url, data, config)
                }
        }

        // 默认导出Request的一个实例对象
        export default new Request({})

        以上, 我们就完成了对axios的初步封装

---

#### 配置`react-router-dom`

##### 1. 基本配置

安装依赖

        pnpm install react-router-dom

在入口文件`main.ts`中, 增加如下的代码：

        import React from 'react'
        import ReactDOM from 'react-dom/client'

        // eslint-disable-next-line import/no-unresolved
        import 'virtual:svg-icons-register'

        ++   import { createBrowserRouter, RouterProvider } from 'react-router-dom'

        --   import App from './App.tsx'
        --   import './index.css'

        ++   const router = createBrowserRouter([
        ++           {
        ++                   path: '/',
        ++                   element: <div>Hello world!</div>,
        ++           },
        ++   ])

        // eslint-disable-next-line import/no-named-as-default-member
        ReactDOM.createRoot(document.getElementById('root')!).render(
                <React.StrictMode>
                --        <App />
                ++        <RouterProvider router={router} />
                </React.StrictMode>,
        )

完成如上配置后, 当我们访问`http://localhost:5173/`的时候, 就可以看到页面中显示的 `Hello world!` , 说明`react-router-dom`的初始化工作已经完成
之后就可以删除初始化项目时生成的`App.tsx`,`App.less`和`index.css`这些没有用的文件。

##### 2. 配置初始路由

为了方便路由的管理, 我们通常会将业务需求中的路由抽离出来, 进行统一的管理

新建`"src/router"`文件夹, 并在该文件夹中新建`index.ts`和`routes.tsx`两个文件

`index.ts`文件： 创建router并注册routes

        # src/router/index.ts

        import { createBrowserRouter } from 'react-router-dom'
        import routes from './routes'

        const router = createBrowserRouter(routes)

        export default router

`routes.ts`文件：routes的统一管理文件

        # src/router/routes.tsx
        <!-- ts类型 -->
        import type { RouteObject } from 'react-router-dom'
        <!-- 路由视图组件 -->
        import Home from '@/views/home'
        import Login from '@/views/login'
        import NotFound from '@/views/not-found'

        const routes = [
                {
                        path: '/',
                        element: <Home />,
                },
                {
                        path: '/login',
                        element: <Login />,
                },
                {
                        path: '/*',
                        element: <NotFound />,
                },
        ] as RouteObject[]

        export default routes

此处, 新增并配置了三个一级路由, 分别是登录Login、首页Home、404NotFound

调整`main.ts`中的代码

        import React from 'react'
        import ReactDOM from 'react-dom/client'

        // eslint-disable-next-line import/no-unresolved
        import 'virtual:svg-icons-register'

        import { RouterProvider } from 'react-router-dom'
        import router from './router'

        import '@/assets/styles/reset.less'

        // eslint-disable-next-line import/no-named-as-default-member
        ReactDOM.createRoot(document.getElementById('root')!).render(
                <React.StrictMode>
                        <RouterProvider router={router} />
                </React.StrictMode>,
        )

---

#### 配置全局状态管理库 - @redux/toolkit [官网](https://redux-toolkit.js.org/tutorials/quick-start)

##### 1. 基本配置

下载并安装依赖 `react-redux` 和 `@reduxjs/toolkit`

        pnpm install react-redux @reduxjs/toolkit

创建`src/redux`文件夹,

1.  在该文件夹下创建`store.ts`文件

        import { configureStore } from '@reduxjs/toolkit'

        const store = configureStore({
                reducer: {},
        })

        export default store

        /*
        ** 导出相关类型
                RootState： 包含store中所有被注册的State
                AppGetState： getState方法的类型
                AppDispatch:  dispatch方法的类型
        */
        export type RootState = ReturnType<typeof store.getState>
        export type AppGetState = typeof store.getState
        export type AppDispatch = typeof store.dispatch

2.  在`main.ts`文件中, 加入与redux-tookit相关的内容：

        import React from 'react'
        import ReactDOM from 'react-dom/client'·

        // eslint-disable-next-line import/no-unresolved
        import 'virtual:svg-icons-register'

        import { RouterProvider } from 'react-router-dom'
        import router from './router'

        ++   /*
        ++    ** redux-tookit
        ++    */
        ++   import { Provider } from 'react-redux'
        ++   import store from './redux/store'

        import '@/assets/styles/reset.less'

        // eslint-disable-next-line import/no-named-as-default-member
        ReactDOM.createRoot(document.getElementById('root')!).render(
                ++   <Provider store={store}>
                        <React.StrictMode>
                                <RouterProvider router={router} />
                        </React.StrictMode>
                ++   </Provider>,
        )

这样, 我们就完成了redux-toolkit的初始化工作, 为React项目提供 ReduxStore 的特性。

3. 根据业务需求, 定义所需要的ReduxStore模块

在`src/redux`文件夹下创建`slices`文件夹

3.1 创建index.ts文件, 统一管理所有的 `xxx-slice.ts` ReduxStore模块

        export { default as user } from './user-slice.ts'
        export { default as xxx } from './xxx-slice.ts'

3.2 创建`user-slice.ts`, 项目中和用户相关的数据状态, 都存储在该文件中

        import { createSlice } from '@reduxjs/toolkit'
        import type { PayloadAction } from '@reduxjs/toolkit'

        export interface UserState {
                value: number
        }

        const initialState: UserState = {
                value: 0,
        }

        export const userSlice = createSlice({
                name: 'global',
                initialState,
                /*
                 ** 同步修改状态的方法
                 */
                reducers: {
                        increment: (state) => {
                                state.value += 1
                        },
                        decrement: (state) => {
                                state.value -= 1
                        },
                        incrementByAmount: (state, action: PayloadAction<number>) => {
                                state.value += action.payload
                        },
                },
        })

        // 导出reducer给store进行注册
        export default userSlice.reducer
        // 导出改变状态的同步方法
        export const { increment, decrement, incrementByAmount } = userSlice.actions
        // 导出改变状态的异步方法

3.3 在`store.ts`中完成对所有`xxx-slice.ts`的注册

        import * as reducer from './reducers'

        reducer: {
                ...reducer, // 注册redecer
        },

3.4 在 `Login` 组件中测试使用并修改 `userSlice` 中存储的值

        import { increment } from '@/redux/reducers/user-slice'
        import { useDispatch, useSelector } from 'react-redux'

        const Login = () => {
                <!-- 痛点：  报错提示：state的类型未知, 对于state没有ts代码提示, 非常的不友好-->
                const user = useSelector((state) => state.user)
                const dispatch = useDispatch()
                const handleClick = () => {
                        dispatch(increment())
                }
                return <div onClick={handleClick}>Login --- {user.value}</div>
        }

        export default Login

至此, 我们已经完成了对`redux-toolkit`的配置工作, 但是针对上述使用过程中产生的痛点, 我们还需要进行以下调整封装

##### 2. 针对使用useSelector的痛点, 封装`useDispatch` 和 `useSelector`

为了更方便的在项目中使用`ReduxStore`,具备更好的代码提示等功能, 我们将对`useDispatch` 和 `useSelector`进行进一步的封装

在`src/redux`文件夹下创建`hooks`文件, 增加以下代码内容

        import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
        import type { AppDispatch, RootState } from './store'

        /*
         ** @see 在整个应用程序中使用 `useAppDispatch` 和 `useAppSelector` 代替 `useDispatch` 和 `useSelector`
         */
        export const useAppDispatch: () => AppDispatch = useDispatch
        export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

我们在组件中整体使用`useAppDispatch` 和 `useAppSelector` 代替 `useDispatch` 和 `useSelector`

调整之后, 在Login组件中测试封装后的Hooks是否可以正常使用

        import { useAppSelector, useAppDispatch } from '@/redux/hooks'
        import { increment, userSelector } from '@/redux/reducers/user-slice'

        const Login = () => {
                const user = useAppSelector(userSelector)
                const dispatch = useAppDispatch()
                const handleClick = () => {
                        dispatch(increment())
                }
                return <div onClick={handleClick}>Login --- {user.value}</div>
        }

        export default Login

此时, 针对state的类型和代码提示就会出现。

---

以上, 我们就完成了项目所需的基本配置, 完成以上内容后, 就可以去完成业务需求了

---
