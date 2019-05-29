// import {websocketUrl} from "api/config";
//
//
// export function socketConnect() {
//     console.log(websocketUrl);
//     // 客户端与服务器进行连接
//     let ws = new WebSocket('ws://115.159.154.194/warehouse/websocket'); // 返回`WebSocket`对象，赋值给变量ws
//     // 连接成功回调
//     ws.onopen = e => {
//         console.log('连接成功', e);
//         ws.send('我发送消息给服务端'); // 客户端与服务器端通信
//     };
//     // 监听服务器端返回的信息
//     ws.onmessage = e => {
//         console.log('服务器端返回：', e.data)
//         // do something
//     };
//
//
//     return ws; // 返回websocket对象
// }

import '@/plugins/sockjs.min'

import '@/plugins/stomp.min'

import store from 'store'

import {getToken} from "./auth";
import {websocketUrl} from "../../api/config";

const socket = new SockJS("http://115.159.154.194/warehouse/websocket");

const stompClient = Stomp.over(socket);

let headers = {
    "name": "xiaoming",
    "x-auth-token": getToken(),
};

export function createSocket() {
    stompClient.connect(headers, (res) => {
        console.log(res);
    })
}

export function delectSocket() {
    stompClient.disconnect();
}


export function startSocket(userId) {
    stompClient.connect(headers, (res) => {
        console.log(res);
        stompClient.subscribe('/messages/' + userId, (body) => {
            console.log(body);
            store.commit('SET_MESSAGE', body);
        });
    })
}


