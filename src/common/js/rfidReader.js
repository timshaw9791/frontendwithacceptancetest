var cmdStr = 'chcp 65001 && adb pull sdcard/inventoryData/inventory.json .', // 从手持机获取文件的命令
    com = 7, // 设备串口号
    newFile_path = "C:/Users/Administrator", // 和手持机相关的文件路径
    testDevelopment = false, // 是否为测试环境
    workerProcess = null; // 子进程实例

if (process.env.NODE_ENV == "production") {
    var exec = window.require('child_process').exec;
    var spawn = window.require('child_process').spawn;
    var cwd = "C:\\Users\\Administrator"; // 执行目录
    var fs = window.require('fs');
}

// 配置读取
/* 设置设备串口号 */
export function setCom(data) {
    com = data
}
/* 获取手持机路径 */
export function getHandheldPath(path) {
    newFile_path = path
}

/* 是否是测试环境 */
export function getDevelopment(state) {
    testDevelopment = state
}




/* 结束所有jps进程 */
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

/* 通过pid删除对应进程 */
export function killProcess(pid) {
    spawn("taskkill", ["/PID", pid, "/T", "/F"]);
}

/** 读写器-连续
 * 
 * @param {String} cmd 调用jar包的语句
 * @param {Function} success 成功的回调(参数 读取的rfid)
 * @param {Function} failure 失败的回调(参数 错误信息)
 * @param {Function} callBack 一定执行的回调(参数 进程启动成功的pid，进程启动失败的信息)
 */
export function start(cmd, success, failure, callBack) {
    var index = 0; // 是否扫描过rfid
    // 用作调试，最终需删除
    console.log("cmd",cmd);
    console.log("com", com);
    console.log("cwd", cwd);
    let process = exec(`${cmd} ${com}`, {cwd: cwd});
    callBack(process.pid, null);
    process.stderr.on("data", err => {
        if (!err.includes("Error")) failure.call(this, err)
        else failure("请插拔读写器后重试")
        index = 1;
        spawn("taskkill", ["/PID", process.pid, "/T", "/F"]); // 结束进程
    });
    process.stdout.on("data", data => {
        // 最终需删除
        console.log("数据：", data);
        if (index == 1) {
            success(data.replace(/[\r\n]/g, ""))
        } else if (index == 0 && JSON.parse(data).status == "succeed") { // 捕获第一次启动读写器返回的成功信息
            index = 1
        }
    });
    process.on("exit", code => {
        if (index == 0) callBack(null, "设备未插入或串口号错误,插入后请重新选择装备!")
        console.log(`子进程退出，退出码 ${code}`);
    });
}

/** 读写器-单次
 * 
 * @param {String} cmd 调用jar包的语句
 * @param {Function} callBack 一定执行的回调
 * @param {RFID} rfid RFID
 */
export function startOne(cmd, callBack, rfid = null) {
    rfid && exec(`${cmd} ${com} ${rfid}`, {cwd: cwd}, (err, data) => callBack(data))
        || exec(`${cmd} ${com}`, {cwd: cwd}, (err, data) => callBack(data))
    // if (rfid) exec(`${cmd} ${com} ${rfid}`, {
    //     cwd: cwd
    // }, (err, data) => {
    //     callBack(data)
    // });
    // else exec(`${cmd} ${com}`, {
    //     cwd: cwd
    // }, (err, data) => {
    //     callBack(data)
    // })
}

/** 删除文件
 * 
 * @param {Path} path 需删除文件的完整路径
 * @param {Function} callBack 删除成功的回调
 */
export function delFile(path, callBack) {
    fs.unlink(path, err => {
        if (err) return false;
        else callBack()
    })
}

/** 手持机 将文件从手持机中赋值出并读取
 * 
 * @param {Function} errCB 失败的回调
 * @param {String} file_name 需读取的文件名
 */
export function handheld(errCB, file_name) {
    // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
    let inventoryFile = `${newFile_path}/${file_name}`,
        errTip = true; // 是否需要报错提示
    cmdStr = 'chcp 65001 && adb pull sdcard/inventoryData/'+file_name+' .';
    console.log("newFile_path",newFile_path)
    // 测试环境使用方法
    if(testDevelopment) {
        let start = new Promise((resolve, reject) => {
            if (fs.existsSync(inventoryFile)) {
                let temp = fs.readFileSync(inventoryFile), result = null;
                try {
                    result = JSON.parse(temp);
                } catch (error) {
                    temp = temp.toString()
                    if(temp.charCodeAt(0) === 0xFEFF) {
                        temp = temp.slice(1)
                    }
                    result = JSON.parse(temp)
                }
                resolve(JSON.stringify(result))
            } else {
                if(errTip) errCB("测试文件不存在");
                console.log("测试文件不存在");
                console.log("inventoryFile", inventoryFile)
            }
        });
        return start
    }

    fs.existsSync(inventoryFile) && fs.unlinkSync(inventoryFile); // 如果文件存在则删除文件，避免读取旧数据
    workerProcess = exec(cmdStr, {cwd: newFile_path});
    // 打印错误的后台可执行程序输出
    workerProcess.stderr.on('data', data => {
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
                let temp = fs.readFileSync(inventoryFile), result = null;
                try {
                    result = JSON.parse(temp);
                } catch (error) {
                    if(temp.charCodeAt(0) === 0xFEFF) { // 当数据含有BOM头时，需要去除BOM头
                        temp = temp.slice(1)
                    }
                    result = JSON.parse(temp)
                }
                resolve(JSON.stringify(result));
            } else {
                if(errTip) errCB("手持机文件导出失败, 所需文件不存在,");
                console.log("手持机文件导出失败, 所需文件不存在");
                console.log("尝试命令行运行","chcp 65001 && adb pull sdcard/inventoryData/[文件名.后缀].");
                console.log("如显示device offline，请插拔手持机重试");
                console.log("如显示含有 cannot create file...，则需在手持机创建intentoryData文件夹");
                console.log('-----------------------------------------');
            }
            console.log('out code：' + code);
        });
    });
    return start
}

/** 将文件导入手持机
 * 
 * @param {*} content 写入文件的数据
 * @param {Function} cb 回调函数
 * @param {String} fileName 写入数据的文件名
 */
export function writeFile(content, cb, fileName) {
    let path = `${newFile_path}/${fileName}`,
        pushCmdStr = `chcp 65001 && adb push ${path} sdcard/inventoryData/in/`,
        needReport = true;
    try {
        fs.writeFileSync(path, JSON.stringify(content))
    } catch (error) {
        cb({state: false, message: "本地文件写入失败"})
        needReport = false
        console.log(error);
    }

    workerProcess = exec(pushCmdStr, {cwd: newFile_path})
    
    workerProcess.stderr.on('data', data => {
        if(data.includes('device') || data.includes('devices')) {
            needReport = false;
            cb({state: false, message: "未发现设备，请检查设备是否连接正常"})
        } else if(data.includes('KB/s')) {
            needReport = false;
            cb({state: true, message: "同步手持机成功"})
        } else if(data.includes('adb') || data.includes('not recognized')) {
            needReport = false;
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
                cb({state: false, message: `手持机连接失败，退出码${code}`})
            }
        }
        console.log('out code: ' + code);
    })
}