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
当我们初始化eslint后，并在第四步 `Where does your code run?` 将 `Browser` 和 `Node` 都选中，当前报错就会消失。

之后，我们在项目的`package.json`中新增一条指令`preinstall`

      "scripts": {
         // ......
         "preinstall": "node ./preinstall.js"
      },

> <br/>
> 此时当我们使用`npm`或者`yarn`来安装包的时候，就会报错了。原理就是在`install`的时候会触发`preinstall（生命周期钩子）`这个文件里面的代码。但是在 NPM v7 以后的版本中，预安装脚本在安装依赖项后运行，这破坏了我们预期的行为。可以跟踪官方issue的处理进展：https://github.com/npm/cli/issues/2660 > 
> <br/>

配置完成后，
如果我们通过 `npm install path -D` 安装依赖时，就会出现如下报错（并不会打印出文件中的内容）,虽然报错的这个行为并不是我们所预期的，但是也确实达到了我们想要统一包管理工具的目的。

      npm ERR! Cannot read properties of null (reading 'matches')

      npm ERR! A complete log of this run can be found in:
      npm ERR!     C:\Users\yuelei\AppData\Local\npm-cache\_logs\2023-08-16T15_10_50_016Z-debug-0.log

而通过 `pnpm install path -D` 安装依赖时，就可以成功安装。

综上，我们就完成了 [**统一包管理工具**](#统一包管理工具) 的项目规范配置。

---

#### 配置eslint [-官网-](https://eslint.org/docs/latest/use/getting-started)

当我们在使用 `vite` 初始化项目时， `vite` 已经默认为我们集成了 `eslint` ，并在 `package.json` 文件中为我们配置好了相关 `scripts` 命令。

      "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",

但是我们需要根据项目实际情况进行调整，按照官网的教程，重新初始化`eslint`

      npm init @eslint/config

**注意：在初始化的第四步 `Where does your code run?` 将 `Browser` 和 `Node` 都选中，这样，eslint就可以识别和node有关的变量了，即解决了我们 `统一包管理工具` 时，遇到的 `'process' is not defined.  eslint(no-undef)` 的报错问题**

重新初始化 `eslint` 后，会有以下改变：
1、更新以下两个依赖 `@typescript-eslint/eslint-plugin` 和 `@typescript-eslint/parser`

         - @typescript-eslint/eslint-plugin 6.0.0
         + @typescript-eslint/eslint-plugin 6.3.0  更新
         - @typescript-eslint/parser 6.0.0
         + @typescript-eslint/parser 6.3.0  更新

2、新增依赖 `eslint-plugin-react`

         + eslint-plugin-react  新增

此时，当我们查看各个文件时，会发现`App.tsx`文件中出现两条报错提示，均和新增的`eslint-plugin-react`依赖相关，说明 `eslint` 中的 `eslint-plugin-react` 已经生效:

1、'React' must be in scope when using JSX 。 eslint (react/react-in-jsx-scope)

针对报错一: 是因为在`react v17`之前的版本，在组件中需要通过`React`对`jsx`进行解析，但是在`react v17`之后，就不再需要使用`React`对jsx进行解析了。根据报错提示，我们只需要在`.eslintrc.cjs`中新增以下代码即可

      "extends": [
         // 新增如下拓展配置
         "plugin:react/jsx-runtime"
      ]

2、Using target="\_blank" without rel="noreferrer" (which implies rel="noopener") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations eslint(react/jsx-no-target-blank)

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
1、eslint-plugin-import ------ 该插件目的在于支持ES6以上的导入/导出语法，并防止文件路径和导入名称拼写错误的问题。【在配置文件夹别名部分进行配置】

---

#### 配置Prettier

安装prettier

      pnpm install prettier -D

在项目根目录添加 `.prettierrc` 文件，在文件中定义项目中所需要的规则 [官网](https://prettier.io/docs/en/options)

**prettier配置文件的名字一定必须要是`.prettierrc`，因为vscode中的Prettier插件默认会读取项目根目录下的`.prettierrc`文件,如果读取不到，就会按照vscode中Prettier插件对文件进行格式化**

      {
         // 你想要添加的规则...
         "singleQuote": true,
         "semi": false
      }

此时，在以下条件下，
1、vscode安装并使用 Prettier 插件
2、设置保存时格式化当前文件

      "editor.formatOnSave": true,

3、设置编辑器默认格式化方式为prettier

      "editor.defaultFormatter": "esbenp.prettier-vscode"

此时，当我们保存某个文件时，Prettier插件会优先读取项目根目录下的`.prettierrc`作为规则文件，如果读取不到，则会按照Prettier插件本身设置的拓展规则作为规则文件，对代码进行格式化.

**但是注意，这种方式配置的prettier，即使出现了代码格式化的问题，也不会以显式的方式体现出来，并不会像eslint代码问题一样，以warn或者error显式的反馈给开发者。而且，这种方式配置的prettier规则和eslint的相关规则会出现冲突的问题。**

##### 解决问题一： 解决冲突

安装eslint-config-prettier [github](https://github.com/prettier/eslint-config-prettier)

      pnpm install eslint-config-prettier -D

然后，需要`.eslintrc.*`文件中，将`"prettier"`作为最后一个扩展添加

      {
         "extends": ["prettier"]
      }

这样，我们就可以不必担心prettier的规则和其他拓展的规则发生冲突，放心的在自己的 `.prettierrc` 文件中设置prettier选项, 并在保存文件时，将配置项应用在被保存的文件中

扩展文章： [ESLint共享配置的两种方式eslint-plugin和eslint-config](https://www.codetd.com/en/article/13434662)

**注意此时，我们解决的个prettier与其他拓展相互冲突的问题，但是prettier生效的方式还是当我们保存文件时，自动格式化当前文件。且代码格式化的问题，依然不会暴露出来**

##### 解决问题二： 将格式化问题暴露出来

在这个问题上，我们期望的是将代码格式化问题，像`eslint`一样以 warn 或者 error 的形式显式地暴露出来，那么我们只需要将`prettier`作为`eslint`的插件来进行使用，就可以达到我们期望的样子。

安装eslint-plugin-prettier [github](https://github.com/prettier/eslint-plugin-prettier)

      pnpm install eslint-plugin-prettier -D

然后，需要`.eslintrc.cjs`文件中，增加如下配置

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
**完成上述配置后，我们会发现组件中出现大量的报错，报错内容可能和我们之前在`.prettierrc`文件中配置的规则冲突，这是因为我们改变了prettier的工作方式，我们现在把它作为eslint的插件进行使用，此时我们在`.prettierrc`文件中配置的规则文件会和`.eslintrc.cjs`配置的规则文件同时生效，所以，我们必须保证两个规则文件的一致性,才可以避免冲突**

我们可以在`.eslintrc.cjs`文件的rules中，将**prettier规则以eslint插件规则**的形式进行配置使用，并保证和`.prettierrc`文件中配置规则保持一致，代码如下

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

为了简化操作流程，还提供了一种简化写法

同时安装 `eslint-config-prettier` `eslint-plugin-prettier`

      pnpm install eslint-config-prettier eslint-plugin-prettier -D

然后，需要`.eslintrc.cjs`文件中，将`"plugin:prettier/recommended"`作为最后一个扩展添加

      {
            "extends": ["plugin:prettier/recommended"]
      }

      就相当于

      {
            "extends": ["prettier"]，
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

最后，在rules中对 `prettier` 规则进行配置即可

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

执行该命令后，该命令会自动为我们做两件事

1、下载 `stylelint` 和 `stylelint-config-standard` 两个依赖

        + "stylelint": "^15.10.2",
        + "stylelint-config-standard": "^34.0.0",

2、新建 `.stylelintrc.json` 文件并初始化配置内容

        { "extends": ["stylelint-config-standard"] }

此时，我们会发现初始化项目时的css文件已经有报错提示

        `Expected empty line before rule (rule-empty-line-before)  Stylelint(rule-empty-line-before)`
        `Unexpected vendor-prefix "-webkit-filter" (property-no-vendor-prefix)  Stylelint(property-no-vendor-prefix)`

说明我们配置的stylelint规则校验已经开始生效。

**注意，初始化stylelint时，自动化命令并没有为我们配置与`stylelint`相关的`scripts`指令，也没有为我们添加对应的忽略文件**

        # package.json

        "scripts": {
                <!-- 其他指令 -->
                "style": "stylelint **/*.{css,less}",
                "style:fix": "stylelint **/*.{css,less} --fix"
        },

配置完指令后，我们就可以使用指令对 `css` 样式文件进行格式化。

在项目根目录新建`.stylelintignore`文件，配置stylelint忽略项

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

###### 使用`stylelint-order`规范css属性的书写顺序，减少浏览器的重绘重排

[正常情况下，不会使用该插件，我们可以选择直接使用配置更少的`stylelint-config-recess-order`预设代替`stylelint-order`，这部分内容作为了解和体验即可]

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
                        <!-- 好几百条css书写顺序规则，使得配置文件非常的多 -->
                ]
    }

###### 使用`stylelint-config-recess-order`预设

它是由社区提供的属性排序的规则，简化了我们使用`"stylelint-order"`时配置上百条css书写顺序的困扰

安装 `stylelint-config-recess-order`

        pnpm install stylelint-config-recess-order -D

使用
在 `.stylelintrc.json` 中增加stylelint-config-recess-order作为扩展项

      {
            "extends": [
                "stylelint-config-standard",
                "stylelint-config-recess-order"
            ],
             <!-- 删除之前长篇大论的配置项 -->
            "plugins": [],
            "rules": {}
      }

此时，我们已经实现了通过`styleleint`针对css的规则校验

---

##### 实现针对`less`的规则校验

###### 实现vite识别`.less`文件

默认情况下，vite是不能识别`.less`文件的，我们需要先让vite可以识别`.less`文件

我们将初始化项目时的`App.css`修改为`App.less`，并在`App.ts`中修改引入的文件为`import './App.less'`
此时，会有报错提示

        Preprocessor dependency "less" not found. Did you install it?

按照操作提示安装`less`

         pnpm install less -D

安装完成后，重新执行`pnpm run dev`,我们发现报错提示消失不见了，此时vite就可以识别`.less`文件。

此时，我们已经完成了实现vite识别`.less`文件

---

但是，此时我们配置的stylelint并不知道如何处理`.less`文件,并且也不能识别less的相关语法，因为我们当时只针对css做了stylelint配置。
所以，当我们使用`pnpm run style` 或者 `pnpm run style：fix`时，会弹出以下报错：

        D:\wilson\vite-project-react\src\App.less: you should use the "customSyntax" option when linting something other than CSS

        src/App.less
        1:1 ✖ Unexpected unknown at-rule "@color:"

解决办法参考[官网](https://stylelint.io/migration-guide/to-14/)后，我们需要进行以下改变：

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

配置完成后，我们发现上述报错就消失了。
此时，stylelint已经知道如何处理`.less`文件，并且识别相关的less语法。

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

至此，我们就完成了stylelint的所有配置工作！

**注意，由于我们在项目中使用了postCSS作为样式文件的预处理器，postCSS会自动为某些属性添加不同浏览器厂商的属性前缀、属性值等等，这个操作是非常必要的，但是会和我们配置好的stylelint中的某些规则发生冲突**

      rules: {
            "at-rule-no-vendor-prefix": true,
            "selector-no-vendor-prefix": true,
            "property-no-vendor-prefix": true,
            "value-no-vendor-prefix": true
      }

此时，我们需要将其进行修改

      rules: {
            // 保留动画名称前可以加浏览器前缀  如@-webkit-keyframes bounce
            "at-rule-no-vendor-prefix": null,
            // 保留各大浏览器不兼容的选择器前缀,      input::-webkit-input-placeholder
            "selector-no-vendor-prefix": null,
            // 保留各大浏览器不兼容的样式属性名前缀， 如 -moz-user-select: auto
            "property-no-vendor-prefix": null,
            // 保留各大浏览器不兼容的样式属性值前缀，display: -webkit-box;
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

执行完该命令后，该命令会自动在项目根目录新建一个`.husky`的文件夹,目录结构如下

        .husky
            _ （以_命名的文件夹）
               .gitignore
                husky.sh
            pre-commit

并且自动在`package.json`文件中，新增一条`scripts`指令

        "scripts": {
                //  else ...·
                "prepare": "husky install"
        }

**注意，执行完第一步的命令后，我们还需要再执行以下代码才可以完全完成husky的初始化工作**

        pnpm install

之后，我们就可以在`pre-commit`的hooks钩子中，配置相关想要执行的代码，例如格式化代码后再提交commit等等

        #!/usr/bin/env sh
        . "$(dirname -- "$0")/_/husky.sh"

        npm run lint:fix
        npm run style:fix
        <!-- 格式化代码后，将自动格式化代码后的文件添加到暂存库，随着本次提交一起commit, 但是会产生一个问题，就是连带其他不想被提交的文件也会一起被提交进去 因此不建议添加 -->
        // git add .

至此，我们已经完成了`husky`的相关配置。

---

##### 使用`lint-staged`优化`husky`的使用

当我们完成了上述对`husky`的配置后，每次commit提交代码之前都会按照对应的规则，对`整个项目文件中的所有文件`进行格式化校验，这个并不是我们所期望的。我们期望的是，当我们执行commit的时候，只对添加到暂存库的文件进行格式化校验。此时，就需要使用lint-staged配合husky一起使用，这样就可以实现我们只想针对暂存区文件进行格式化校验的目的了。

安装lint-staged

        pnpm install lint-staged -D

在`package.json`文件中，配置`lint-staged`配置项

        "lint-staged": {
                "*.{js,jsx,cjs,ts,tsx}": [
                        "eslint --fix"
                ],
                "*.{css,less}": [
                        "stylelint --fix"
                ]
        },

完成`lint-staged`配置项的配置后，我们就可以搭配`husky`一起使用，达到我们之前的预期效果。

在`.husky/pre-commit`中修改代码为

        #!/usr/bin/env sh
        . "$(dirname -- "$0")/_/husky.sh"
        <!-- 只需要改这一行代码 -->
        npx lint-staged

以上，我们就完成了使用`lint-staged`优化`husky`的使用

#### 配置husky

根据husky官网进行husky的初始化 [官网](https://typicode.github.io/husky/getting-started.html)

自动化初始化

        pnpm dlx husky-init

> <br/>It will:
> 1、Add prepare script to package.json
> 2、Create a sample pre-commit hook that you can edit (by default, npm test will run when you commit)
> 3、Configure Git hooks path
> <br/>

执行完该命令后，该命令会在项目根目录新建一个`.husky`的文件夹,目录结构如下

        .husky
            _ （以_命名的文件夹）
               .gitignore
                husky.sh
            pre-commit

并且在`package.json`文件中，新增一条`scripts`指令

        "scripts": {
                //  else ...·
                "prepare": "husky install"
        }

**注意，执行完第一步的命令后，我们还需要再执行以下代码才可以完全完成husky的初始化工作**

        pnpm install

之后，我们就可以在`pre-commit`的hooks钩子中，配置相关想要执行的代码，例如格式化代码后再提交commit等等

        #!/usr/bin/env sh
        . "$(dirname -- "$0")/_/husky.sh"

        npm run lint:fix
        npm run style:fix
        <!-- 格式化代码后，将自动格式化代码后的文件添加到暂存库，随着本次提交一起commit, 但是会产生一个问题，就是连带其他不想被提交的文件也会一起被提交进去 因此不建议添加 -->
        // git add .

至此，我们已经完成了`husky`的相关配置。

---

##### 使用`lint-staged`优化`husky`的使用

当我们完成了上述对`husky`的配置后，每次commit提交代码之前都会按照对应的规则，对`整个项目文件中的所有文件`进行格式化校验，这个并不是我们所期望的。我们期望的是，当我们执行commit的时候，只对添加到暂存库的文件进行格式化校验。此时，就需要使用lint-staged配合husky一起使用，这样就可以实现我们只想针对暂存区文件进行格式化校验的目的了。

安装lint-staged

        pnpm install lint-staged -D

在`package.json`文件中，配置`lint-staged`配置项

        "lint-staged": {
                "*.{js,jsx,cjs,ts,tsx}": [
                        "eslint --fix"
                ],
                "*.{css,less}": [
                        "stylelint --fix"
                ]
        },

完成`lint-staged`配置项的配置后，我们就可以搭配`husky`一起使用，达到我们之前的预期效果。

在`.husky/pre-commit`中修改代码为

        #!/usr/bin/env sh
        . "$(dirname -- "$0")/_/husky.sh"
        <!-- 只需要改这一行代码 -->
        npx lint-staged

以上，我们就完成了使用`lint-staged`优化`husky`的使用

---

---

---

## 项目开发配置

### 文件别名的配置

文件别名的配置主要从以下两方面进行，

1、打包时，对于文件夹别名的处理,打包过程中如果不知道 @ 代表那个文件夹，则会直接报错。
2、编译时，对于文件夹别名的处理

##### 针对打包时，文件夹别名的处理

在项目根目录，`vite.config.ts`文件的配置项中，配置与文件夹别名有关的`resolve`配置项

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

**注意，当我们增加如下配置后，会报错提示 `找不到名称"__dirname"` , 这是因为 `path` 模块是 `node.js` 的内置模块，而 `node.js` 默认是不支持 `ts` 文件的, 此时我们安装针对 `node` 的ts依赖包 `@types/node` 即可**

        pnpm install @types/node -D

这样，我们就告知了`vite`相关文件夹别名的信息，这样就不会在打包的过程中报错，提示与文件夹别名有关的错误了。

##### 针对编译时，文件夹别名的处理

主要从以下两个方面进行处理：
1、针对ts的编译提示
2、针对插件的编译检查
是否使用了针对导出/引入检查的插件，如果有，那么则需要针对插件的编译检查进行相关的配置（因此大部分情况下，这些插件默认是不支持文件夹别名的）

###### 针对ts的编译提示（主要配置的是提示关系）

`ts` 默认是不支持文件夹别名的，但是注意，当你在 `ts文件` 中使用文件夹别名，例如 `"@"`, ts是不会有报错提示的， 它只是不会提示`"@"`中的内容了， 例如，当我们输入`"@"`时，ts不会提示任何和文件夹相关的信息，如 `"@/components/ComponentA..."`, 因为它不知道 `"@"` 表示什么， 为了使`ts`可以为更好的提示`"@"`中的内容，我们需要针对 `针对ts的编译提示` 进行相关的配置

在项目根目录的`tsconfig.json`中的`compilerOptions配置项`增加以下配置：

        "compilerOptions": {
                /* alias */
                <!-- 定义文件与文件查找的基本关系 -->
                "baseUrl": "./",
                <!-- 路径映射，此处是结合baseUrl使用的，还可根据项目需要自行配置提示关系 -->
                "paths": {
                        "@/*":["src/*"]
                }
        },

配置完成后，当我们输入`"@"`时，ts就会将`"@"`提示为`src`文件夹，嘎嘎好使！

###### 针对插件的编译检查

扩展：eslint部分
我们配置 `eslint-plugin-import` 这个插件，这个插件支持ES2015+（ES6+）导入/导出语法的覆盖，并防止文件路径和导入名称的拼写问题。

但是这个插件，其默认是不支持文件夹别名的，当其遇到文件夹别名的时候，不知道要如何进行处理，因此我们需要 `针对插件的编译检查` 进行相关的配置
