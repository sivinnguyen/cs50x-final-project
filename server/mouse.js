'use strict'

import robot from 'robotjs'

robot.setMouseDelay(0)

const mouse = {
    screen: robot.getScreenSize(),
    pos: null,
    adjustment: {
        x: 10,
        y: 10
    },
    getPos: function () {
        this.pos = robot.getMousePos()
        console.log (`current postion: ${this.pos.x} , ${this.pos.y}`)
    },
    stop: function () {
        this.getPos()
        robot.moveMouse(this.pos.x, this.pos.y)
    },
    move: function (body) {
        
        var x = this.pos.x + body.delta.x,
            y = this.pos.y + body.delta.y
        robot.moveMouse(x, y)

        // get current mouse postion
        this.getPos()
    },
    sHandleMouse: function (cmd, body) {
        if(cmd == 'panstart') {
            this.getPos()
        }

        if(cmd == 'panmove') {
            this.move(body)
        }
    }
}

// Export the mouse object
export default mouse