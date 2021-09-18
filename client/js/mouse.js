'use strict'

// Get a reference to an element.
const touchpad = document.getElementById('touchpad')
const cursor = document.getElementById('cursor')


/** 
 * Cursor controller
 **/

// Handle cursor
const handleCur = (pos, delta, action) => {
    
    if(action == 'start') {
        gsap.set('.cursor', {x: pos.x, y: pos.y, display: "block"});
    }

    if(action == 'end') {
        gsap.set('.cursor', {display: "none"});
    }

    if(action == 'move') {
        curMove(pos, delta)
    }
}

// Cursor movement
const curMove = (pos, delta) => {
    var d = Math.min(20, Math.sqrt(delta.x * delta.x + delta.y * delta.y)) / 400,
        r = (180 * Math.atan2(delta.y, delta.x)) / Math.PI
        
    gsap.set('.cursor', {
        x: pos.x,
        y: pos.y,
        scaleX: 1 + d,
        rotation: r
    })
}


/** 
 * Mouse controller
 **/

// Declare mouse properties
const mouse = {
    type: 'mouse',
    cmd: null,
    body: {
        delta: {
            x: null,
            y: null
        }
    },
}


// Handle mouse
const handleMouse = async (command, delta) => {
    mouse.cmd = command
    mouse.body.delta = delta

    await socket.send(JSON.stringify(mouse))
}


/** 
 * Hammer setting
 **/

// Create an instance of Hammer
const mc = new Hammer.Manager(touchpad, {
    recognizers: [
        [Hammer.Pan, {direction: Hammer.DIRECTION_ALL, threshold: 10}]
    ]
})

// Subscribe to events
mc.on('panstart panend panmove', (e) => {
    handlePan(e)
})

// Handle pan event
const handlePan = async (e) => {
    if(e.type == 'panstart') {
        handleCur(e.center, null, 'start')
        await handleMouse(e.type, {x: 0, y: 0})
    }

    if(e.type == 'panend') {
        await handleCur(null, null, 'end')
        //handleMouse(e.type, {x: 0, y: 0})
    }

    if(e.type == 'panmove') {
        var delta = {
            x: e.deltaX,
            y: e.deltaY
        }
        handleCur(e.center, delta, 'move')
        await handleMouse(e.type, delta)
    }
}