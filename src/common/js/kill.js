// export function killProcess() {
//     let newData = [];
//      const exec = window.require('child_process').exec;
//     const spawn = window.require('child_process').spawn;
//     exec("jps", ["/L"], (err, data) => {
//         newData = data.split('\n');
//         newData.some(value => {
//             if (value.includes('jar')) {
//                 spawn("taskkill", ["/PID", parseInt(value), "/T", "/F"]);
//                 console.log('进程删除成功');
//                 return true
//             }
//         })
//     })
// }

// export function killProcessSync() {
//     return new Promise((resolve, reject) => {
//         let newData = [];
//         const exec = window.require('child_process').exec;
//         const spawn = window.require('child_process').spawn;
//         exec("jps", ["/L"], (err, data) => {
//             if (err) {
//                 reject(err);
//             }
//             newData = data.split('\n');
//             newData.some(value => {
//                 if (value.includes('jar')) {
//                     spawn("taskkill", ["/PID", parseInt(value), "/T", "/F"]);
//                     console.log('进程删除成功');
//                     return true
//                 }
//             });
//             resolve('true')
//         })
//     })

// }


