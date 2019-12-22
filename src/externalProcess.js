/***
 * 调用外部程序都放在这个地方，以便统一管理（只有在electron环境下才调用真正的程序，在web环境下如有必要需要模拟）
 * //TODO 考虑测试环境下提供硬件的mock
 * web环境（要考虑开发和运行环境吗？），electron开发环境和真正的electron运行环境
 * 1.看是否electron开发或运行环境：判断electron对象是否有值？这个
 * 2.是否开发环境：看process.env.NODE_ENV是否为dev/development

 *注意： 这些外部工具必须放到exe对应的external文件夹下。
 *
 * @type {boolean|__RULES__.require|RTCIceCandidate}
 */
const electron = window.require && window.require('electron') && window.require('electron').remote;
const isDev=process && process.env &&  (process.env.NODE_ENV==="dev" || process.env.NODE_ENV==="development")


const path = window.require && window.require('path');
const exec = window.require && window.require('child_process').exec;
// const spawn = window.require('child_process').spawn;

/**
 * 获取要执行命令的路径
 * @returns {string}
 */
function getCwd(){
//如果是开发时，则返回external文件夹路径，如果时exe运行时，则直接返回exe安装路径下的external文件夹路径
    return path.join(isDev?electron.app.getAppPath():path.dirname(electron.app.getPath("exe")),'external');
}

/**
 * 开启视频监控界面，如果给定毫秒数事件，指的是调用主摄像头，回放当时的视频。
 * 更多详细参数请参见视频回放程序的camWindowsConfig.properties

 * @param playbackinmilseconds
 */
 export function startProcessCamVideo(playbackinmilseconds){
     console.log("process="+process);
     console.log("process.env="+process.env);
     console.log("process.env.NODE_ENV="+process.env.NODE_ENV);
     console.log("electron="+electron);
     if(electron){ //判断运行环境。注意一定要考虑到在web环境下(也即非electron环境）如何让我们开发者不用修改代码
         var cmd=getCwd();
         //TODO 此处的字符串最好能外置或者放到最前面
         var exepath="\""+path.join(cmd,"jre1.8.0_231\\bin\\java")+"\""+" -jar CamPlayer.jar "+(playbackinmilseconds?playbackinmilseconds:"");
         console.log(exepath);
         exec(exepath,{cwd:cmd}, (error, stdout, stderr) => {
             if (error) {
                 console.error(`执行的错误: ${error}`);
                 return;
             }
             console.log(`stdout: ${stdout}`);
             console.error(`stderr: ${stderr}`);
         });
     }
}