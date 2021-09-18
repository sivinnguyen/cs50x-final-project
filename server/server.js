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
    await server._limitClients(req, connection.socket)

    connection.socket.on('message', async message => {
        if (message) {
            var data = JSON.parse(message)
            console.log(data) // remove later

            if(data.type == 'mouse') {
                await mouse.sHandleMouse(data.cmd, data.body)
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
    console.log(`[${req.ip}] connected...`, server.websocketServer.clients.size)

    if (server.websocketServer.clients.size > num) {
        console.log(`[${req.ip}] denied...`)
        socket.close(4001, `[server] Only ${num} connection(s) per time!`)
    } else {
        socket.send('[server] Hi from server!')
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