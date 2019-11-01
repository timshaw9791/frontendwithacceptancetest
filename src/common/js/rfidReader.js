if (process.env.NODE_ENV == "production") {
    var exec = window.require('child_process').exec;
    var spawn = window.require('child_process').spawn;
    var cwd = "C:\\Users\\Administrator"; // 执行目录
    //var com = JSON.parse(localStorage.getItem('deploy'))['UHF_READ_COM']; // 端口 串口号
    var com = 9
}

var newFile_path = 'C:\\Users\\Administrator\\inventory.json'; // 手持机路径
var cmdPath = 'C:\\Users\\Administrator'; // 读卡器路径
var cmdStr = 'chcp 65001 && adb pull sdcard/inventoryData/inventory.json .';
 // var com = 7
var workerProcess; // 子进程名

export  function setCom(data) {
    com = data
}

/* 结束对应进程 */
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

        callBack(process.pid, null)

        process.stderr.on("data", err => {
            console.log(err);
            if(!err.includes("Error"))  failure.call(this, err)
            index = 1;
            //callBack(null, "设备故障请重新插拔!插入后请重新选择装备")
            spawn("taskkill", ["/PID", process.pid, "/T", "/F"]);
            //killProcess();
        });

        process.stdout.on("data", data => {
            if(index == 1) {
                success(data)
            }else if (index == 0 && JSON.parse(data).status == "succeed") {
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
export function startOne(cmd, callBack, rfid=null) {
    if(rfid) exec(`${cmd} ${com} ${rfid}`, {cwd: cwd}, (err, data) => {callBack(data)})
    else exec(`${cmd} ${com}`, {cwd: cwd}, (err, data) => {callBack(data)})
}

/* 删除文件 */
export function delFile(path, callBack) {
    fs.unlink(path, err => {
        if(err) return false
        else callBack()
    })
}

/* 手持机 */
export function handheld() {
    // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
    
    fs.exists(newFile_path, exists => {
        if(exists) {
            fs.unlinkSync(newFile_path);
        }
    })

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
    });

    return start
}
