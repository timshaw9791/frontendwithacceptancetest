const fs = window.require('fs');
const path = window.require('path');

const newFile_path = path.join(__dirname, '\\adb\\inventoryData.json').replace(/\\/g, "\/");
const exec = window.require('child_process').exec;

let cmdStr = 'chcp 65001 && adb pull sdcard/inventoryData/inventoryData.json .';
// 执行cmd命令的目录，如果使用cd xx && 上面的命令，这种将会无法正常退出子进程
let cmdPath = path.join(__dirname, 'adb').replace(/\\/g, "\/");
// 子进程名称
let workerProcess;

export function handheld() {
    // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
    console.log('cmdPath: ' + cmdPath);
    console.log('cmdStr: ' + cmdStr);
    workerProcess = exec(cmdStr, {cwd: cmdPath})
    // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})

    // 打印正常的后台可执行程序输出
    workerProcess.stdout.on('data',  (data)=> {
        console.log('stdout: ' + data);
        fs.exists(newFile_path,  (exists)=> {
            //读取本地的json文件
            let result = JSON.parse(fs.readFileSync(newFile_path));
            console.log('result: ' + JSON.stringify(result));
            //遍历读取到的用户对象，进行登录验证
        });
    });

    // 打印错误的后台可执行程序输出
    workerProcess.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    // 退出之后的输出
    workerProcess.on('close', function (code) {
        console.log('out code：' + code);
    })
}