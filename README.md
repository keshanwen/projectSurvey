### 项目描述：
1. 这个项目里面会有很多不同的页面，但是这些页面本身没有任何关系和关联，每个页面都必须是独立的url，相互不影响。
2. 这些页面里面会有些通用的js逻辑代码，比如埋点，获取用户信息，桥方法。
3. 部分页面会用相同的UI组件库，这些UI组件库来自同个。
 
### 技术架构上的要求有：
1. 各个页面在开发过程不能相互影响。
2. 部署的时候可以只更新调整的页面，不用重新部署其他页面
3. 如果使用了相同的lib中得方法，那么打包的时候对应的页面里面只能包含当前页面的代码和使用到的公用代码，不要把多余的公用代码打包进来。
4. 开发阶段尽量屏蔽非业务的配置逻辑，让开发可以快速的了解某个页面并进入开发。
5. 页面因为要考虑多语言，所以多语言的配置可能是整个项目公用的locales文件，但是打包只需要打包这个页面中使用的key，不要打包所有多语言的key。
6. 页面打包之后资源如果很少可以考虑资源直接打包到html文件里面，如果资源很多可以有单独的资源文件但是要加载快，因为这些页面都是在app的webview里面使用。

[参考文章](https://juejin.cn/post/7215886869199896637 带你了解更全面的 Monorepo - 优劣、踩坑、选型)

# monorepo 


## monorepo

* 解决单一仓库管理多个项目。
* 更好的目录组织结构，代码共享。


### pnpm-workspace.yaml
是pnpm工作区（workspace）的配置文件，pnpm会根据这个文件来识别出哪些项目是工作区中的项目。

#### 主要作用
1. 定义工作区范围
```javascript
packages:
  - "apps/*"      # 所有应用程序
  - "packages/*"  # 所有共享包
  - "components"  # 单个包目录
```
告诉pnpm哪些目录包含可能需要被管理的包。
支持通配符模式功能。

2， 启用工作区功能
* 依赖提升： 将共同的依赖安装在根目录的 node_modules 中.
* 符合连接： 工作区内的包相互引用时使用本地连接。
* 统一安装： 一次性安装所有包的依赖。
* 跨包脚本执行： 可以在根目录运行所有包或者特定包的脚本。

3. 实际项目结构实例
```javascript
my-monorepo/
├── pnpm-workspace.yaml    # ← 就是这个文件
├── package.json           # 根项目的 package.json
├── apps/
│   ├── web-app/
│   │   └── package.json
│   └── mobile-app/
│       └── package.json
└── packages/
    ├── shared-utils/
    │   └── package.json
    └── ui-components/
        └── package.json
```
4. 常用配置项
```javascript
packages:
  - "apps/*"
  - "packages/*"
  - "!**/test/**"      # 排除测试目录
  - "!**/__tests__/**" # 排除测试目录

link-workspace-packages: true  # 优先链接工作区包
shared-workspace-lockfile: true # 共享锁文件（默认）
```
```javascript
# 复杂项目结构示例
packages:
  - "apps/*"           # 所有应用
  - "packages/*"       # 所有共享包
  - "libs/*"           # 库文件
  - "tools/*"          # 工具脚本
  - "docs"             # 文档站点
  - "!**/templates/**" # 排除模板目录
```
5. 工作原理
当你在根目录运行 pnpm install：

（1）pnpm 读取 pnpm-workspace.yaml

（2）扫描 apps/ 和 packages/ 下的所有 package.json

（3）分析依赖关系图

（4）将公共依赖安装在根 node_modules

（5）为工作区内的包创建符号链接


```javascript
// 查看所有包的依赖关系（包括软连接）
pnpm list -r

// 只查看顶层依赖
pnpm list -r --depth=0
// 查看特定包的链接状态
pnpm why <package-name> -r

// 查看所有本地包的链接
pnpm ls -r | grep "link:"
```
```javascript
/*

  启动项目
  1， 直接进入到你的项目中启动脚本。

  2， 直接在monorepo 工程的根目录执行 
    pnpm --filter project1-vue3 dev
    --filter 过滤/选择特定包
    dev 要运行的命令 通常是 package.json 中的 script

    这一块后期为了方便可以直接在更目录下写一个可视化交换脚本，减少操作负担。
*/ 
```


### Svete 
* 编译时优化
* 极简设计

### 适用场景
* 高性能需求应用
* 轻量级项目
* 渐进式增强

### 潜在考量
* 生态规模：社区和第三方库虽在增长，但相比 React/Vue 仍较小。
* 企业采用率：大型企业案例较少，但正在上升（如 Apple、Spotify 部分使用）。
* 编译依赖：需构建步骤（类似 Vue/React，但不可直接通过 CDN 使用运行时版本）。



