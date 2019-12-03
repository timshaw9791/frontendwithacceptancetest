if (process.env.NODE_ENV == "production") {
    var exec = window.require('child_process').exec;
    var spawn = window.require('child_process').spawn;
    var cwd = "C:\\Users\\Administrator"; // 执行目录
    //var com = JSON.parse(localStorage.getItem('deploy'))['UHF_READ_COM']; // 端口 串口号
    var com = 9;
    var fs = window.require('fs');
    var newFile_path = 'C:/Users/Administrator/inventory.json'; // 手持机路径
    var inventoryFile = `inventory.json`;
}

var cmdPath = 'C:\\Users\\Administrator'; // 读卡器路径
var cmdStr = 'chcp 65001 && adb pull sdcard/inventoryData/inventory.json .';
var fileName = 'inventory.json';
// var com = 7
var workerProcess; // 子进程名

// 配置读取
export function setCom(data) {
    com = data
}
export function modifyFileName(data) {
    fileName = data
}
/* 获取手持机路径 */
export function getHandheldPath(path) {
    newFile_path = path
}


/* 结束对应进程 */
export function killProcessSync() {
    return new Promise((resolve, reject) => {
        let newData = [];
        exec("jps", ["/L"], (err, data) => {
            if (err) {
                reject(err);
            }
            newData = data.split('\n');
            newData.some(value => {
                if (value.includes('jar')) {
                    spawn("taskkill", ["/PID", parseInt(value), "/T", "/F"]);
                    console.log('进程删除成功');
                    return true
                }
            });
            resolve('true')
        })
    })

}

export function killProcess(pid) {
    spawn("taskkill", ["/PID", pid, "/T", "/F"]);
}

/* 读卡器-连续 */
export function start(cmd, success, failure, callBack) {
    //killProcessSync().then(() => {
    var index = 0; // 是否扫描过rfid

    let process = exec(`${cmd} ${com}`, {
        cwd: cwd
    });

    callBack(process.pid, null);
    process.stderr.on("data", err => {
        console.log(err);
        if (!err.includes("Error")) failure.call(this, err)
        index = 1;
        //callBack(null, "设备故障请重新插拔!插入后请重新选择装备")
        spawn("taskkill", ["/PID", process.pid, "/T", "/F"]);
        //killProcess();
    });

    process.stdout.on("data", data => {
        if (index == 1) {
            success(data.replace(/[\r\n]/g, ""))
        } else if (index == 0 && JSON.parse(data).status == "succeed") {
            index = 1
        }
    });

    process.on("exit", code => {
        if (index == 0) callBack(null, "设备未插入或串口号错误,插入后请重新选择装备!")

        console.log(`子进程退出，退出码 ${code}`);
    });
    //})
}

/* 读卡器-单次 */
export function startOne(cmd, callBack, rfid = null) {
    if (rfid) exec(`${cmd} ${com} ${rfid}`, {
        cwd: cwd
    }, (err, data) => {
        callBack(data)
    })
    else exec(`${cmd} ${com}`, {
        cwd: cwd
    }, (err, data) => {
        callBack(data)
    })
}

/* 删除文件 */
export function delFile(path, callBack) {
    fs.unlink(path, err => {
        if (err) return false;
        else callBack()
    })
}

/* 手持机 */
export function handheld(errCB) {
    // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
    inventoryFile = `${newFile_path}/${fileName}`;
    if (fs.existsSync(inventoryFile)) {
        fs.unlinkSync(inventoryFile);
    }
    let errTip = true;
    workerProcess = exec(cmdStr, {
        cwd: newFile_path
    });


    // let start = new Promise((resolve, reject) => {
    //     workerProcess.stdout.on('data', (data) => {
    //         if(fs.existsSync(inventoryFile)) {
    //             let result = JSON.parse(fs.readFileSync(inventoryFile));
    //             resolve(JSON.stringify(result));
    //         } else {
    //             console.log("文件不存在");
    //         }

    //         // fs.exists(inventoryFile, (exists) => {
    //         //     //读取本地的json文件
    //         //     if (exists) {
    //         //         let result = JSON.parse(fs.readFileSync(inventoryFile));
    //         //         resolve(JSON.stringify(result));
    //         //     } else {
    //         //         console.log("文件不存在");
    //         //     }
    //         //     //遍历读取到的用户对象，进行登录验证
    //         // });
    //     })
    // });


    // 打印错误的后台可执行程序输出
    workerProcess.stderr.on('data', (data) => {
        if(data.includes("device")) { 
            errCB("未发现设备，请检查设备连接是否正常");
            errTip = false;
        }
        console.log('stderr: ' + data);
    });
    let start = new Promise((resolve, reject) => {
        // 退出之后的输出
        workerProcess.on('close', (code) => {
            if (fs.existsSync(inventoryFile)) {
                let result = JSON.parse(fs.readFileSync(inventoryFile));
                resolve(JSON.stringify(result));
            } else {
                if(errTip) errCB("文件不存在");
                console.log("文件不存在");
            }
            console.log('out code：' + code);
        });
    });
    return start
}

/* 导出文件 */
export function writeFile(content, cb) {
    let path = `${newFile_path}/equip.json`,
        pushCmdStr = `chcp 65001 && adb push ${path} sdcard/inventoryData/`,
        needReport = true;
    try {
        fs.writeFileSync(path, JSON.stringify(content))
    } catch (error) {
        cb({state: false, message: "本地文件写入失败"})
        needReport = false
        console.log(error);
    }
    workerProcess = exec(pushCmdStr, {
        cwd: newFile_path
    })
    
    workerProcess.stderr.on('data', data => {
        if(data.includes('device') || data.includes('devices')) {
            needReport = false
            cb({state: false, message: "未发现设备，请检查设备是否连接正常"})
        } else if(data.includes('KB/s')) {
            needReport = false
            cb({state: true, message: "同步手持机成功"})
        } else if(data.includes('adb') || data.includes('not recognized')) {
            needReport = false
            cb({state: false, message: "ADB驱动未安装"})
        }
        console.log(data);
    })

    workerProcess.on('close', code => {
        if(needReport) {
            needReport = false
            if(code == 0) {
                cb({state: true, message: "同步手持机成功"})
            } else {
                cb({state: false, message: `命令发生错误，退出码${code}`})
            }
        }
        console.log('out code: ' + code);
    })
}