# threejs scaffold

## Description

This scaffold only has simplest function to use threejs which is the cube example for webpack

# Install

To install this, you can follow the codes.
'folderName' can be any folder name

You need install yarn before using

```bash
npm install yarn -g
```

and then

```bash
npx create-webpack-threejs [folderName]
cd [folderName]
yarn install
yarn start
```

## start example

```bash
yarn start
```

## Content

-   dev config `webpack.config.dev.js`
-   -   babel
-   -   css module
-   -   html template
-   -   devServer

-   prod config `webpack.config.prod.js`
-   -   css extract
-   -   hash8 filename
-   -   copy public
-   -   split chunks

> You can modify the `output.publicPath` configuration in `webpack.config.prod.js` to set the url prefix for static resources.

## 说明

-   本样例以 three-loader 为基础，作为 potree 核心功能的替代，使之能够完全以 threejs 源 camera,scene,renderer 的方式进行渲染点云功能
-   本样例暂包含 potree 中的点云渲染、切割盒、EDL 阴影渲染功能

# 安装

必须已安装 [node.js](http://nodejs.org/)

并已安装 yarn

如未安装 yarn 可通过

```bash
npm install yarn -g
```

若已安装 yarn，可直接在根目录运行

```
npx create-webpack-threejs [folderName]
cd [folderName]
yarn install
```

## 启动样例

运行

```bash
yarn start
```

即可


### 代码功能位置

点云鼠标射线与点的交点-主要在 operation.js 中
EDL 功能主要在 edl 开头的文件中
生成切割盒位于 clipboxes.js 中
