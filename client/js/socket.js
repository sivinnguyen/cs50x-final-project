'use strict'

const origin = location.origin.replace('http', 'ws')
const WS_URL = `${origin}/ws`

const container = document.getElementById('container')
const buttonReload = document.getElementById('button__reload')
// const buttonExit = document.getElementById('button__exit')
const dialog = document.getElementById('dialog')

const socket = new WebSocket(WS_URL)

socket.onopen = function (e) {
    console.log('[open] Connection established!')
    container.style.visibility = 'visible'
}

socket.onclose = function (e) {
    console.log(e)
    var message = e.reason

    if(e.code == 4001) {
        console.log(e.reason)
    }

    if(e.code == 4011) {
        window.location.href = "./incompatible.html";
    }

    if(e.code == 1006) {
        console.log('[server] shut down!')
        message = '[server] shut down!'
    }

    console.log('[close] Disconnected!')
    showDialog(message)
}

socket.onerror = function (e) {
    console.log(e)
    showDialog(e.reason)
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

// Button functions
buttonReload.addEventListener('click', (e) => {
    e.preventDefault()
    location.reload()
})

// Not work
// https://stackoverflow.com/questions/2076299/how-to-close-current-tab-in-a-browser-window
/* buttonExit.addEventListener('click', (e) => {
    e.preventDefault()

    var confirm_result = confirm("Are you sure you want to quit?");
    if (confirm_result == true) {
        window.close();
    }
})*/

const showDialog = (message) => {
    var messenger = document.getElementById('dialog__message')
    messenger.innerText = message
    
    dialog.style.display = 'flex'
    container.style.visibility = 'visible'
}