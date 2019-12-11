# 3

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
npm run start (如果我们要进行electron版本调试的话，还需要另起terminal启动这句）
```

### Compiles and minifies for production
```
npm run build  #(for web only，在dist文件夹下)
npm run package #(for electron,打包exe)
```
###完整electron exe运行注意事项
```
1.需要将外部工具（如视频监控、读卡器程序等相关程序放置到external文件夹下，相关内容请找阿灿
2.和硬件或其他程序的交互请尽可能迁移到externalProcess.js文件中。
2.注意这个external文件夹不需要保存在git
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

