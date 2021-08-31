'use strict'

// Intellisense doesn't work if fastify including by "require"
import fastify from "fastify"
import fastifyStatic from "fastify-static"
import fastifySocket from "fastify-websocket"

import path from "path"
import ip from "ip"
import qrcode from "qrcode-terminal"

const server = fastify({ logger: false })
server._port = 3000

// Resolve "__dirname is not defined in ES module scope" 
// https://stackoverflow.com/a/68163774/1813901
const __dirname = path.resolve()


// Enable static plugins
server.register(fastifyStatic, {
    root: path.join(__dirname, 'client')
})

// Enable websocket plugin
server.register(fastifySocket, {
    options: {
        // Limit number of client can connect to server
        // Can't handle status code on client side
        verifyClient(info, next) {
            if (server.websocketServer.clients.size > 0) {
                return next(false, 401,"[server] only one connection per time")
            }
            return next(true)
        }
    }
})


// Declare websocket server
server.get('/ws', { websocket: true }, (connection, req) => {
    connection.socket.on("message", message => {
        if (message) {
            console.log(message.toString())
        }
        connection.socket.send('[server] hi from server!')
    })
})

/*
 * Limit the users can connect to websocket server
 * @param {socket} socket The websocket
 * @param {number} num The number of clients, default = 1
 * @return {void}
 */
server._limitClients = (socket, num = 1) => {
    console.log("client connected...", server.websocketServer.clients.size)
    
    if (server.websocketServer.clients.size > num) {
        console.log("connection denied...")
        socket.close(101, `[server] only ${num} connection(s) per time`)
    }
    
    return
}


// Run the server !
server.init = () => {
    try {
        // listen on all available IPv4 interfaces
        server.listen(server._port, '0.0.0.0', () => {
            var address = `http://${ip.address()}:${server._port}`

            // generate qrcode
            qrcode.generate(address, {small: true})
            console.info(`server listening at ${address}\n`)
            
            // detect client connection
            server.websocketServer.on("connection", (socket, req) => {
                console.log("client connected...", server.websocketServer.clients.size)
                
                // Does'n work T_T
                // server._limitClients = (socket)
            })
        })
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

// Export the server
export default server