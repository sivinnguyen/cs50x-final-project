/** 
 * Mouse controller
 **/

'use strict'

import { mouse as Mouse, Point, straightTo } from '@nut-tree/nut-js'

// Setting mouse speed (pixel/sec)
Mouse.config.mouseSpeed = 5000

// Mouse object
const mouse = {
    screen: null,
    pos: null,
    adjustment: null,
    // get mouse position
    getPos: async function () {
        await Mouse.getPosition().then(point => this.pos = point)
        // console.log (`current postion: ${this.pos}`)
    },
    // move mouse like human do
    move: async function (body) {
        // get current mouse postion
        await this.getPos()
        
        var x = this.pos.x + body.delta.x,
            y = this.pos.y + body.delta.y

        const point = new Point(x, y)
        await Mouse.move(straightTo(point))
    },
    // handle mouse actions
    sHandleMouse: async function (cmd, body) {
        if(cmd == 'panstart') {
            await this.getPos()
        }

        if(cmd == 'panmove') {
            await this.move(body)
        }

        if(cmd == 'leftclick') {
            await Mouse.leftClick()
        }
    }
}

// Export the mouse object
export default mouse