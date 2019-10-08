// const fs = window.require('fs');

// const newFile_path = 'C:\\Users\\Administrator\\inventory.json';

// let cmdPath = 'C:\\Users\\Administrator';

// const exec = window.require('child_process').exec;

// let cmdStr = 'chcp 65001 && adb pull sdcard/inventoryData/inventory.json .';

// 子进程名称
let workerProcess;

export function handheld() {
    // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
    fs.unlinkSync(newFile_path);

    workerProcess = exec(cmdStr, {cwd: cmdPath});

    // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})

    // 打印正常的后台可执行程序输出
    let start = new Promise((resolve, reject) => {
        workerProcess.stdout.on('data', (data) => {
            fs.exists(newFile_path, (exists) => {
                //读取本地的json文件
                if (exists) {
                    let result = JSON.parse(fs.readFileSync(newFile_path));
                    resolve(JSON.stringify(result));
                } else {
                    console.log(exists)
                }
                //遍历读取到的用户对象，进行登录验证
            });
        })
    });


    // 打印错误的后台可执行程序输出
    workerProcess.stderr.on('data', (data) => {
        console.log('stderr: ' + data);
    });

    // 退出之后的输出
    workerProcess.on('close', (code) => {
        console.log('out code：' + code);
    })

    return start
}

