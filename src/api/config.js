/**
 * Created by Administrator on 2018/6/5.
 */

import { setCom } from 'common/js/rfidReader'
export const ERR_OK = 0;





var baseURL = 'http://10.128.1.109:8010/warehouse';
var baseBURL = 'http://10.128.1.198:8020/warehouse_server';
var localTitle = "龙湾区公安局应急装备物资管理系统";

// export let baseURL = 'http://192.168.50.14:8010/warehouse';

// export let baseBURL = 'http://115.159.154.194/warehouse_server';
if (process.env.NODE_ENV == "production") {
    let fs = window.require('fs'), result, path = 'C:\\config.json';
    result = fs.readFileSync(path).toString()
    result = eval(`(${result})`)
    baseURL = `http://${result.HOUSE_SERVER}`;
    baseBURL = `http://${result.B_SERVER}`
    localTitle = `${result.A_CLIENT_TITLE}`
    setCom(result.UHF_READ_COM)
}

export { baseURL, baseBURL, localTitle}
export const imgBaseUrl = `${baseURL}/images/`;
export const pdfBaseUrl = `${baseURL}/pdfs/`;
export const videoBaseUrl = `${baseURL}/videos/`;

export const imgUpUrl = `${baseURL}/upload/image`;
export const pdfUpUrl = `${baseURL}/upload/pdf`;
export const videoUpUrl = `${baseURL}/upload/video`;

export const websocketUrl = `${baseURL}/websocket`;

export const tokenName = 'x-auth-token';