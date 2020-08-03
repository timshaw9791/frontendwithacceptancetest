import { hardwareWS } from 'api/config'

const ws = new WebSocket(hardwareWS)
ws.onopen = function() {
    console.log("连接")
}

ws.onmessage = function(data) {
    console.log(data)
}

ws.onclose = function() {
    console.log("连接关闭")
}

ws.onerror = function (error) {
    console.error(error)
}

export default {
    state: {
        ws: ws
    },
    mutations: {
        readInfo(state, command='scan-start') {
            console.log(command)
            ws.send(command)
        }
    }
}