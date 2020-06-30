# 库房管理C端
采用npm管理web的开发，采用yarn管理electron下的操作。因为yarn提供了--cwd参数以便指定在另一个目录下运行npm类似功能(可以参见.npmrc配置文件).
这给了我们分开web和electron打包的机会。因为原来统一用npm来管理这两个工作的包时失败了，因为这句（"postinstall": "electron-builder install-app-deps"）在cnpm install后会检查npm_modules(这其中包括web的依赖和electron的依赖），复杂的依赖关系会让检查陷入死循环。而用cnpm和yarn分开管理这两部分依赖后，只需要滑板检查yarn管理的electron部分的依赖。而yarn提供的cwd参数又能让我们操作者在项目根目录下（不用切换到electron目录）运行两种意图的命令。
yarn和npm的对照，可以参照 https://yarnpkg.com/lang/en/docs/migrating-from-npm/

## Project setup
```
npm install
yarn install （如果要打包为electron，需要做这个准备，或者yarn upgrade
```

### Compiles and hot-reloads for development
```
npm run serve
yarn start (如果我们要进行electron版本调试的话，还需要另起terminal启动这句）
```

### Compiles and minifies for production
```
npm run build  #(for web only，在electron/dist文件夹下)
yarn package #(for electron,在前一句的基础上还需要运行这句打包exe)
```
###完整electron exe运行注意事项
```
1.需要将外部工具（如视频监控、读写器程序等相关程序放置到electron/external文件夹下，相关内容请找阿灿
2.和硬件或其他程序的交互请尽可能迁移到externalProcess.js文件中。
2.注意这个electron/external文件夹不需要保存在git
```
### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 打包问题
出现 .git/config： 在electron文件夹下的package.json文件夹中添加
在第一层
"repository": { 
    "type": "git",
    "url": "https://github.com/timshaw9791/policeEquipmentSystem.git"
 },
 或者
 "build": {
     "win": {
       "publish":null 加上这句话
     }
   }