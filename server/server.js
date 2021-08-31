'use strict'

// Intellisense doesn't work if fastify including by "require"
import fastify from "fastify"
import fastifyStatic from "fastify-static"
import fastifySocket from "fastify-websocket"

import path from "path"
import ip from "ip"
import qrcode from "qrcode-terminal"

const server = fastify({ logger: false })
const port = 3000

// Resolve "__dirname is not defined in ES module scope" 
// https://stackoverflow.com/a/68163774/1813901
const __dirname = path.resolve()


// Enable static plugins
server.register(fastifyStatic, {
    root: path.join(__dirname, 'client')
})

// Enable websocket plugin
server.register(fastifySocket)


// Declare websocket server
server.get('/ws', { websocket: true }, (connection, req) => {
    connection.socket.on("message", message => {
        if (message) {
            console.log(message.toString())
        }
        connection.socket.send('[server] hi from server!')
    })
})


// Run the server !
server.init = () => {
    try {
        // listen on all available IPv4 interfaces
        server.listen(port, '0.0.0.0', () => {
            var address = `http://${ip.address()}:${port}`

            // generate qrcode
            qrcode.generate(address, {small: true})
            console.info(`server listening at ${address}...`)
            
            // detect client connection
            server.websocketServer.on("connection", () => {
                console.log("client connected...")
            })
        })
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

// Export the server
export default server