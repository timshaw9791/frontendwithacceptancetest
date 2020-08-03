/* 硬件设备(读写器、手持机)方法文件 */
import { Message } from 'element-ui'
var cmdStr = 'chcp 65001 && adb pull sdcard/inventoryData/inventory.json .', // 从手持机获取文件的命令
    com = 7, // 设备串口号
    newFile_path = "C:/Users/Administrator", // 和手持机相关的文件路径
    testDevelopment = false, // 是否为测试环境
    workerProcess = null, // 子进程实例
    hardwareWS = "ws://localhost:26789/websocket/4", // 读写器websocket地址
    ws = null; // 读写器websocket实例

if (process.env.NODE_ENV == "production") {
    var exec = window.require('child_process').exec,
         spawn = window.require('child_process').spawn,
         cwd = "C:\\Users\\Administrator", // 执行目录
         fs = window.require('fs');
} else {
    createWS()
}

// 配置读取
/* 设置设备串口号 */
function setCom(data) {
    com = data
}
/* 获取手持机路径 */
function getHandheldPath(path) {
    newFile_path = path
}
/* 获取读写器的ws地址 */
function getWebSocket(wsURL) {
    hardwareWS = wsURL
    createWS()
}
/* 是否是测试环境 */
function getDevelopment(state) {
    testDevelopment = state
}

/* 结束所有jps进程 */
function killProcessSync() {
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
function killProcess(pid) {
    !!pid && spawn("taskkill", ["/PID", pid, "/T", "/F"]);
}

/** 读写器-连续
 * 
 * @param {String} cmd 调用jar包的语句
 * @param {Function} success 成功的回调(参数 读取的rfid)
 * @param {Function} failure 失败的回调(参数 错误信息)
 * @param {Function} callBack 一定执行的回调(参数 进程启动成功的pid，进程启动失败的信息)
 */
function start(cmd, success, failure, callBack) {
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
function startOne(cmd, callBack, rfid = null) {
    rfid && exec(`${cmd} ${com} ${rfid}`, {cwd: cwd}, (err, data) => callBack(data))
        || exec(`${cmd} ${com}`, {cwd: cwd}, (err, data) => callBack(data))
}

/** 删除文件
 * 
 * @param {Path} path 需删除文件的完整路径
 * @param {Function} callBack 删除成功的回调
 */
function delFile(path, callBack) {
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
function handheld(errCB, file_name) {
    return new Promise((reslove, reject) => {
        exec(`adb shell cat /sdcard/inventoryData/out/${file_name}`, (err, stdout, stderr) => {
            if(err) {
                if(err.message.includes('device not found')) {
                    errCB('未发现手持机设备')
                } else if(err.message.includes('unauthorized')) {
                    errCB("请在手持机上授权本机调试")
                } else if(err.message.includes('adb')) {
                    errCB('未安装ADB驱动')
                } else {
                    errCB('未知错误')
                }
                console.error(err.message);
                reject();
            } else if(stderr) {
                console.error(stderr);
               reject()
            } else if(stdout.includes('No such file')) {
                console.error("读取失败，请检查手持机上是否存在该文件");
                console.info("目录", `/sdcard/inventoryData/out/${file_name}`);
                errCB('读取失败，请检查手持机上是否存在该文件');
                reject()
            } else {
                reslove(stdout)
            }
        })
    })
}

/** 删除(清空)手持机中对应的文件
 * 
 * @param {String} file_name 需要删除(清空)的文件名[在 sdcard/inventoryData/out 目录下]
 * @param {Function} cb 回调函数
 */
function clearAdbFile(file_name, cb) {
    let cmdCommand = `adb shell rm sdcard/inventoryData/out/${file_name}`,
        success = true;
    workerProcess = exec(cmdCommand)
    workerProcess.stderr.on('data', data => {
        if(data.includes("device")) { 
            cb({status: false, message: "未发现设备，请检查设备连接是否正常"});
        }
        console.log('stderr: ' + data);
    });
    workerProcess.stdout.on('data', data => {
        success = false;
        if(data.includes('No such')) {
            cb({status: false, message: "文件已被删除或者文件路径错误"});
        }
        console.log('错误', data);
    })
    workerProcess.on('close', code => {
        success && cb({status: true, message: "文件清空成功"});
        console.info("退出码", code);
    })
}

/** 将文件导入手持机
 * 
 * @param {*} content 写入文件的数据
 * @param {Function} cb 回调函数
 * @param {String} fileName 写入数据的文件名
 */
function writeFile(content, cb, fileName) {
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

function createWS() {
    ws = new WebSocket(hardwareWS)
    ws.onopen = function() {
        console.log("读写器硬件连接")
    }
    ws.onclose = function() {
        console.log("连接关闭")
    }
    ws.onerror = function (error) {
        console.error(error)
    }
}

function wsReadInfo(command='scan-start', callBack=null, backFirst=false) {
    ws.send(command)
    ws.onmessage = function(data) {
        if(data.data === 'Success') {
            console.log(`${command}执行成功`)
            backFirst && callBack && callBack(data.data)
        } else if(data.data.includes('Failed')) {
            console.error("执行失败", data.data)
            Message.error('执行失败:'+data.data.replace(/Failed/, ""))
        } else {
            callBack(data.data)
        }
    }
}

export {
    setCom,
    getHandheldPath,
    getDevelopment,
    killProcessSync,
    killProcess,
    start,
    startOne,
    delFile,
    handheld,
    clearAdbFile,
    writeFile,
    wsReadInfo,
    getWebSocket,
    createWS
}