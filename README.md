## 简介

项目名称: 医护对讲后台管理系统V2.0

1. [gitlab地址](http://172.16.200.42/MedicalSystem/MedicalIntercomSystem_PCWeb_Vue) [项目下载地址](git@172.16.200.42:MedicalSystem/MedicalIntercomSystem_PCWeb_Vue.git)

2. [http接口文档](http://172.16.200.18:8000/html/web/controller/console/console.html)

3. [MQTT协议文档](https://shimo.im/docs/vVqRVXrx6oHdg1qy)

## 特性
 基于 vben-admin V2.9.x [官方文档地址](https://vvbin.cn/doc-next/)，进行二次开发。主要技术栈：`Vue3.0`、`TypeScript` 、 `Ant-Design-Vue` 、`tailwindcss`、`Vite`、 如果不想用 vben 封装的组件，可按需引入 ant-desgin 的组件。

- **最新技术栈**：使用 Vue3/vite2 等前端前沿技术开发
- **TypeScript**: 应用程序级 JavaScript 的语言
- **主题**：可配置的主题
- **国际化**：内置完善的国际化方案
- **Mock 数据** 内置 Mock 数据方案
- **权限** 内置完善的动态路由权限生成方案
- **组件** 二次封装了多个常用的组件

## 项目结构
├── build # 打包脚本相关
│   ├── config # 配置文件
│   ├── generate # 生成器
│   ├── script # 脚本
│   └── vite # vite配置
├── mock # mock文件夹
├── public # 公共静态资源目录
├── docs # 复杂功能、项目结构的原理图和说明文档
├── src # 主目录
│   ├── api # 接口文件
│   ├── assets # 资源文件
│   │   ├── icons # icon sprite 图标文件夹
│   │   ├── images # 项目存放图片的文件夹
│   │   └── svg # 项目存放svg图片的文件夹
│   ├── components # 公共组件
│   ├── design # 样式文件
│   ├── directives # 指令
│   ├── enums # 枚举/常量
│   ├── hooks # hook
│   │   ├── component # 组件相关hook
│   │   ├── core # 基础hook
│   │   ├── event # 事件相关hook
│   │   ├── setting # 配置相关hook
│   │   └── web # web相关hook
│   ├── layouts # 布局文件
│   │   ├── default # 默认布局
│   │   ├── iframe # iframe布局
│   │   └── page # 页面布局
│   ├── locales # 多语言
│   ├── logics # 逻辑
│   ├── main.ts # 主入口
│   ├── router # 路由配置
│   ├── settings # 项目配置
│   │   ├── componentSetting.ts # 组件配置
│   │   ├── designSetting.ts # 样式配置
│   │   ├── encryptionSetting.ts # 加密配置
│   │   ├── localeSetting.ts # 多语言配置
│   │   ├── projectSetting.ts # 项目配置
│   │   └── siteSetting.ts # 站点配置
│   ├── store # 数据仓库
│   ├── utils # 工具类
│   └── views # 页面
├── test # 测试
│   └── server # 测试用到的服务
│       ├── api # 测试服务器
│       ├── upload # 测试上传服务器
│       └── websocket # 测试ws服务器
├── types # 类型文件
├── vite.config.ts # vite配置文件
└── windi.config.ts # windcss配置文件

## 准备

- [node](http://nodejs.org/) 和 [git](https://git-scm.com/) -项目开发环境
- [Vite](https://vitejs.dev/) - 熟悉 vite 特性
- [Vue3](https://v3.vuejs.org/) - 熟悉 Vue 基础语法
- [TypeScript](https://www.typescriptlang.org/) - 熟悉`TypeScript`基本语法
- [Es6+](http://es6.ruanyifeng.com/) - 熟悉 es6 基本语法
- [Vue-Router-Next](https://next.router.vuejs.org/) - 熟悉 vue-router 基本使用
- [Ant-Design-Vue](https://2x.antdv.com/docs/vue/introduce-cn/) - ui 基本使用
- [Mock.js](https://github.com/nuysoft/Mock) - mockjs 基本语法

## 安装使用 
pnpm install

- 运行
pnpm serve

- 打包
pnpm build

## pnpm 使用

官网： https://pnpm.js.org/installation/ 全局安装 npm install pnpm -g

设置源 //查看源 pnpm config get registry //切换淘宝源 pnpm config set registry http://registry.npm.taobao.org 使用 pnpm install 包 // pnpm i 包 pnpm add 包 // -S 默认写入 dependencies pnpm add -D // -D devDependencies pnpm add -g // 全局安装移除 pnpm remove 包 //移除包 pnpm remove 包 --global //移除全局包更新 pnpm up //更新所有依赖项 pnpm upgrade 包 //更新包 pnpm upgrade 包 --global //更新全局包设置存储路径 pnpm config set store-dir /path/to/.pnpm-store 个人使用一些需要 node-gyp 的包一定要记得安装好在系统上禁止使用脚本解决方法

# 以管理员身份运行 power shell

set-executionpolicy remotesigned

[说明] 以上指令是最优操作，由于公司加密环境，pnpm 可能会受限，出现依赖包下载不完整情况，可以使用window系统自带的终端 用管理员身份运行 Window PowerShell， 用npm 下载依赖包、运行、打包：

- 安装依赖：npm install 
- 运行：npm run serve 
- 打包：npm run build 

[注意] 如果项目运行过程中，出现乱码，报错esbuild相关的错误，请找信息部-俊俊，针对esbuild开放软件使用权限，更改加密策略

## vscode 插件

1. Iconify IntelliSense - Iconify 图标插件
2. windicss IntelliSense - windicss 提示插件
3. I18n-ally - i18n 插件
4. Vetur - vue 开发必备 （也可以选择 Volar）
5. ESLint - 脚本代码检查
6. Prettier - 代码格式化
7. Stylelint - css 格式化
8. DotENV - .env 文件 高亮

**Pull Request:**

1. Fork 代码!
2. 创建自己的分支: `git checkout -b feat/xxxx`
3. 提交你的修改: `git commit -am 'feat(function): add xxxxx'`
4. 推送您的分支: `git push origin feat/xxxx`
5. 提交`pull request`

## Git 贡献提交规范

- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` 增加新功能
  - `fix` 修复问题/BUG
  - `style` 代码风格相关无影响运行结果的
  - `perf` 优化/性能提升
  - `refactor` 重构
  - `revert` 撤销修改
  - `test` 测试相关
  - `docs` 文档/注释
  - `chore` 依赖更新/脚手架配置修改等
  - `workflow` 工作流改进
  - `ci` 持续集成
  - `types` 类型定义文件更改
  - `wip` 开发中
  - `mod` 不确定分类的修改

  示例：git commit -m 'feat(home): add home page'  
  [格式说明] git commit -m 'feat(关键字): 简要说明' ; 关键字：可以是模块名字、页面路由、功能关键字 [注意] 上面的 feat(home): 这里的冒号一定是英文模式下的，冒号后面一定要加空格；

## 浏览器支持

本地开发推荐使用`Chrome 80+` 浏览器

支持现代浏览器, 不支持 IE

## 相关仓库

- [vite-plugin-mock](https://github.com/anncwb/vite-plugin-mock) - 用于本地及开发环境数据 mock
- [vite-plugin-html](https://github.com/anncwb/vite-plugin-html) - 用于 html 模版转换及压缩
- [vite-plugin-style-import](https://github.com/anncwb/vite-plugin-style-import) - 用于组件库样式按需引入3
- [vite-plugin-theme](https://github.com/anncwb/vite-plugin-theme) - 用于在线切换主题色等颜色相关配置
- [vite-plugin-imagemin](https://github.com/anncwb/vite-plugin-imagemin) - 用于打包压缩图片资源
- [vite-plugin-compression](https://github.com/anncwb/vite-plugin-compression) - 用于打包输出.gz|.brotil 文件
- [vite-plugin-svg-icons](https://github.com/anncwb/vite-plugin-svg-icons) - 用于快速生成 svg 雪碧图


## 更多的项目说明

对于一些复杂功能，可将原理图和说明放置本项目docs文件夹下面， 新建一个文件夹存着