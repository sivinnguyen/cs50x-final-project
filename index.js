import server from "./server/server.js"

const app = {}

app.init = () => {
    server.init()
}

app.init()