
import '@/plugins/sockjs.min'

import '@/plugins/stomp.min'

import store from 'store'

import {getToken} from "./auth";

import {baseURL} from "../../api/config";


const socket = new SockJS(`${baseURL}/warehouse/websocket`);

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


