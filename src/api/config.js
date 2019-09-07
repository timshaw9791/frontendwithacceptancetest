/**
 * Created by Administrator on 2018/6/5.
 */


export const ERR_OK = 0;

// export let baseURL = 'http://192.168.50.14:8010/warehouse';
//
// export let baseBURL = 'http://115.159.154.194/warehouse_server';

export let baseURL = 'http://47.199.32.111:8010/warehouse';
export let baseBURL = 'http://47.199.32.118/warehouse_server';


// export let baseURL = 'http://10.128.1.198:8080/warehouse';
// export let baseBURL = 'http://115.159.154.194/warehouse_server';





export const imgBaseUrl = `${baseURL}/images/`;
export const pdfBaseUrl = `${baseURL}/pdfs/`;
export const videoBaseUrl = `${baseURL}/videos/`;

export const imgUpUrl = `${baseURL}/upload/image`;
export const pdfUpUrl = `${baseURL}/upload/pdf`;
export const videoUpUrl = `${baseURL}/upload/video`;

export const websocketUrl = `${baseURL}/websocket`;

export const tokenName = 'x-auth-token';
