if (process.env.NODE_ENV == "production") {
    const exec = window.require('child_process').exec;
    const spawn = window.require('child_process').spawn;
    var cwd = "C:\\Users\\10359"; // 执行目录
    var com = JSON.parse(localStorage.getItem('deploy'))['UHF_READ_COM']; // 端口 串口号
}
var com = 4

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


export function start(cmd, success, failure, callBack) {
    killProcessSync().then(() => {
        var index = 0; // 是否扫描过rfid

        let process = exec(`${cmd} ${com}`, {
            cwd: cwd
        });

        callBack(process.pid, null)

        process.stderr.on("data", err => {
            console.log(err);
            failure.call(this, err)
            index = 1
            //callBack(null, "设备故障请重新插拔!插入后请重新选择装备")
            spawn("taskkill", ["/PID", process.pid, "/T", "/F"]);
            //killProcess();
        });

        process.stdout.on("data", data => {
            if (index == 0 && JSON.parse(data).status == "succeed") {
                index = 1
            } else {
                success(data)
            }
        });

        process.on("exit", code => {
            if (index == 0) callBack(null, "设备未插入或串口号错误,插入后请重新选择装备!")
            
            console.log(`子进程退出，退出码 ${code}`);
        });
    })
}