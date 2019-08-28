# operator-pc

node 版本：v8.\*

## http request

### 开始

```js
yarn install
// or
yarn i

yarn start
```

### example

```js
import { request } from './src/modules/request';

request.get('https://example.com', { a: 1, b: 2 }).then(
  (res) => {
    // ...
  },
  (error) => {
    // ...
  }
);

// URL 带参数
// get: https://example.com/1/2?a=a&b=b
request
  .get(
    'https://example.com/:userId/:param2',
    { a: 'a', b: 'b' },
    { restParams: { userId: 1, param2: 2 } }
  )
  .then(
    (res) => {
      // ...
    },
    (error) => {
      // ...
    }
  );
```

### proxy

本地代理请求设置

在根目录下建立 `.env.local` 或 `.env.development.local` 文件，设置代理请求的路径与地址:

```
proxy1=/api/*=http://test-1.yilou.17shihui.com
proxy2=/b/*=http://test-2.yilou.17shihui.com
```

也可以在 `package.json` 文件中设置 `proxy` 字段

```json
{
  "proxy": {
    "/api/*": {
      "target": "http://yl-phzc.test.yilou.17shihui.com",
      "secure": false,
      "changeOrigin": true
    }
  }
}
```

> ## 如何启动代理服务

```
  yarn start < test / dev / mock >
  如果不传如参数 则启动 测试环境代理
  如果传入 dev 则启动 开发环境代理

  如果传入 mock 则启动 mock 环境代理
  需要在 .env.local 文件中配置 mock 环境代理

  如 : http://rest.apizza.net/mock/fe331c5764b00d8017916bf5c96f28d2
```

## 集成桌面应用
* 添加依赖
```
yarn add electron electron-is-dev
yarn add electron-builder --dev
yarn add foreman --dev
```
* 添加electron主程序
```
cd src && touch electron-starter.js && vim electron-starter.js
// 代码参考src/electron-starter.js
```
* 添加electron入口程序
```
// 添加如下配置  "main": "src/electron-starter.js" 至package.json
```
* 添加启动electron命令
```
// 添加如下脚本 "electron": "electron ." 至package.json
```
* 使用Foreman管理React和Electron
```
touch Procfile
// 添加如下配置：  
react: yarn react-start
electron: yarn electron-start

cd src && touch electron-wait-react.js
// 代码参考src/electron-wait-react.js

// 修改start脚本
"start": "nf start",
```
* 启动
```
yarn start
```
* 打包
```
// 修改build脚本
"build": "node scripts/build.js && electron-builder --mac --win"
// 添加electron打包配置
//详见package.json build{}
// 执行打包脚本
yarn build
```
