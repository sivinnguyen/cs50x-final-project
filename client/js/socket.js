'use strict'

window.addEventListener('DOMContentLoaded', (event) => {
    const origin = location.origin.replace('http', 'ws')
    const WS_URL = `${origin}/ws`

    const socket = new WebSocket(WS_URL)

    socket.onopen = function (e) {
        console.log("[open] Connection established")
        socket.send("[client] hi there!")
    }

    socket.onmessage = function (message) {
        console.log(message.data)
    }
})