/**
 * Created by Administrator on 2018/6/5.
 */

import { setCom, getHandheldPath, getDevelopment, getWebSocket } from 'common/js/rfidReader'
export const ERR_OK = 0;





// var baseURL = 'http://192.168.137.2:8010/warehouse';
// var baseURL = 'http://115.159.154.194/warehouse_512';
var baseURL = 'http://192.168.1.44:8010/warehouse';
var baseBURL = 'http://115.159.154.194/police-support-platform';
var localTitle = "上海静安分局";

// export let baseURL = 'http://192.168.50.14:8010/warehouse';
// export let baseBURL = 'http://115.159.154.194/warehouse_server';



getHandheldPath('/adm')
getDevelopment(false)
if (process.env.NODE_ENV == "production") {
    let fs = window.require('fs'), result, path = 'C:\\config.json';
    result = fs.readFileSync(path).toString();
    result = eval(`(${result})`);
    baseURL = `http://${result.HOUSE_SERVER}`;
    baseBURL = `http://${result.PLATFORM_URL}`;
    localTitle = `${result.A_CLIENT_TITLE}`;
    setCom(result.UHF_READ_COM);
    getHandheldPath(result.INVENTORY_PATH);
    getDevelopment(result.TEST_DEVELOPMENT);
    // getWebSocket(`ws://localhost:26789/websocket/${result.UHF_READ_COM}`)
}

export const imgBaseUrl = `${baseURL}/images/`;
export const pdfBaseUrl = `${baseURL}/pdfs/`;
export const videoBaseUrl = `${baseURL}/videos/`;

export const imgUpUrl = `${baseURL}/upload/image`;
export const pdfUpUrl = `${baseURL}/upload/pdf`;
export const videoUpUrl = `${baseURL}/upload/video`;

export const tokenName = 'x-auth-token';

export { baseURL, baseBURL, localTitle }