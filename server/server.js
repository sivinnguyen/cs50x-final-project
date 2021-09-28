'use strict'

// Intellisense doesn't work if fastify including by "require"
import fastify from "fastify"
import fastifyStatic from "fastify-static"
import fastifySocket from "fastify-websocket"

import path from "path"
import ip from "ip"
import qrcode from "qrcode-terminal"

import mouse from "./mouse.js"

const server = fastify({ logger: false })


// Set configurations
server.decorate('_conf', {
    port: 3000,
    // resolve "__dirname is not defined in ES module scope" 
    // https://stackoverflow.com/a/68163774/1813901
    dirname: path.resolve()
})


// Enable static plugins
server.register(fastifyStatic, {
    root: path.join(server._conf.dirname, 'client')
})

// Enable websocket plugin
server.register(fastifySocket)


// Declare websocket server
server.get('/ws', { websocket: true }, async (connection, req) => {
    console.log(`[${req.ip}] connected...`, server.websocketServer.clients.size)

    // Only allow connection from mobile device
    await server._checkUserAgent(req, connection.socket)

    // Limit connection
    await server._limitClients(req, connection.socket)

    connection.socket.on('message', message => {
        if (message) {
            var data = JSON.parse(message)
            console.log(data) // remove later

            if(data.type == 'mouse') {
                mouse.sHandleMouse(data.cmd, data.body)
            }
        }
    })

    connection.socket.on('close',(code) => {
        if(code == 1001) {
            console.log(`[${req.ip}] left...`)
        }
    })
})

/*
 * Limit the users can connect to websocket server
 * @param {socket} socket The websocket
 * @param {number} num The number of clients, default = 1
 * @return {void}
 */
server.decorate('_limitClients', (req, socket, num = 1) => {
    if (server.websocketServer.clients.size > num) {
        console.log(`[${req.ip}] denied...`)
        socket.close(4001, `[server] only ${num} connection(s) per time!`)
    } else {
        socket.send('[server] Hi from server!')
    }
    
    return
})

/*
 * Close connection when user not connect from mobile devices
 * @param {string} useragent from request
 * @return {void}
 */
server.decorate('_checkUserAgent', (req, socket) => {
    var pattern = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i

    if(!pattern.test(req.headers['user-agent'])) {
        console.log(`[${req.ip}] denied...`)
        socket.close(4011, `[server] Device is not supported`)
    }
    
    return
})


// Run the server !
server.decorate('_init', () => {
    try {
        // listen on all available IPv4 interfaces
        server.listen(server._conf.port, '0.0.0.0', () => {
            var address = `http://${ip.address()}:${server._conf.port}`

            // generate qrcode
            qrcode.generate(address, {small: true})
            console.info(`server listening at ${address}\n`)
        })
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
})

// Export the server
export default server