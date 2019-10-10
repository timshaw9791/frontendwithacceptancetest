/**
 * Created by Administrator on 2018/6/5.
 */


export const ERR_OK = 0;





var baseURL = 'http://192.168.50.14:8010/warehouse';
var baseBURL = 'http://115.159.154.194/warehouse_server';

// export let baseURL = 'http://192.168.50.14:8010/warehouse';

// export let baseBURL = 'http://115.159.154.194/warehouse_server';
if (process.env.NODE_ENV == "production") {
    let fs = window.require('fs'), result, path = 'C:\\Users\\Administrator\\config.json';
    result = fs.readFileSync(path).toString()
    result = eval(`(${result})`)
    baseURL = `http://${result.ORGAN_UNIT_IP}:8010/warehouse`;
    baseBURL = `http://${result.MAIN_SERVER_IP}/warehouse_server`
}
 
export { baseURL, baseBURL}
export const imgBaseUrl = `${baseURL}/images/`;
export const pdfBaseUrl = `${baseURL}/pdfs/`;
export const videoBaseUrl = `${baseURL}/videos/`;

export const imgUpUrl = `${baseURL}/upload/image`;
export const pdfUpUrl = `${baseURL}/upload/pdf`;
export const videoUpUrl = `${baseURL}/upload/video`;

export const websocketUrl = `${baseURL}/websocket`;

export const tokenName = 'x-auth-token';

