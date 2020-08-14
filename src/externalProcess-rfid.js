/***
 * 
 * //TODO 本文件依赖于rfidReader.js
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

import { start, killProcess } from 'common/js/rfidReader'

/**
 * 如果需要被mock，请加上_且把下面的同名函数用上。
 * 需要更好的mock切换机制，如添加环境变量到dev或者product到package.json
 * 
 */
function rfidReader_(){

    var processId;

    /**
     * 开始读取
     * @param {*} successCallback 
     * @param {*} failureCallback 
     * @param {*} callback 
     * @param {*} context 
     */
    function startRead(successCallback,failureCallback,callback,context){
        processId && killProcess(processId);
        start("java -jar scan.jar", (data) => {
            successCallback && successCallback.call(context,data);
        }, (fail) => {
            failureCallback && failureCallback.call(context,fail);    
        }, (pid, err) => { 
            pid? processId=pid: callback && callback.call(context,pid,err);
           })
    }
    
    /**
     * 关闭读卡器
     */
    function close(){
        processId && killProcess(processId);
    }

    return {startRead,close};

}

function rfidReader(){
    function startRead(successCallback,failureCallback,callback,context){
        debugger;
        successCallback && successCallback.call(context,'12345689');  
        successCallback && successCallback.call(context,'87654321');      
    }
    
    /**
     * 关闭读卡器
     */
    function close(){  
    }

    return {startRead,close};
}


export {
    rfidReader
 }
