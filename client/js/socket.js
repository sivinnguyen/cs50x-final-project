'use strict'

const origin = location.origin.replace('http', 'ws')
const WS_URL = `${origin}/ws`

const socket = new WebSocket(WS_URL)

socket.onopen = function (e) {
    console.log('[open] Connection established!')
}

socket.onclose = function (e) {
    console.log(e)
    if(e.code == 4001) {
        console.log(e.reason)
    }

    if(e.code == 4011) {
        window.location.href = "./incompatible.html";
    }

    if(e.code == 1006) {
        console.log('[server] shut down! ')
    }

    console.log('[close] Disconnected!')
}

socket.onerror = function (e) {
    console.log(e)
}

socket.onmessage = function (message) {
    console.log(message.data)
}

// Close connection when tab closed
// https://stackoverflow.com/questions/4812686/closing-websocket-correctly-html5-javascript
window.addEventListener('unload', function(e) {
    if(socket.readyState == WebSocket.OPEN) {
        socket.close(1001)
    }
})