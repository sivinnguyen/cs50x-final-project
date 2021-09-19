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

    if(action == 'leftclick') {
        gsap.set('.cursor', {x: pos.x, y: pos.y, display: "block"})
        gsap.to('.cursor', {duration: 0.5, display: "none"});
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
const handleMouse = (command, delta) => {
    mouse.cmd = command
    mouse.body.delta = delta

    socket.send(JSON.stringify(mouse))
}


/** 
 * Hammer setting
 **/

// Create an instance of Hammer
const mc = new Hammer.Manager(touchpad, {
    recognizers: [
        [Hammer.Pan, {direction: Hammer.DIRECTION_ALL, threshold: 10}],
        [Hammer.Tap, {event: 'leftclick', pointers: 1, taps: 1}],
        [Hammer.Tap, {event: 'grab', pointers: 2, taps: 1}],
        [Hammer.Press, {event: 'rightclick', pointers: 1, time: 1000}]
    ]
})

// Subscribe to events
mc.on('panstart panend panmove', (e) => {
    handlePan(e)
})

mc.on('leftclick rightclick grab', (e) => {
    console.log(e)
    handleClick(e)
})

// Handle pan event
const handlePan = (e) => {
    if(e.type == 'panstart') {
        handleCur(e.center, null, 'start')
    }

    if(e.type == 'panend') {
        handleCur(null, null, 'end')
    }

    if(e.type == 'panmove') {
        var delta = {
            x: e.deltaX,
            y: e.deltaY
        }
        handleCur(e.center, delta, 'move')
        handleMouse(e.type, delta)
    }
}

// Handle click events
const handleClick = (e) => {
    handleCur(e.center, null, e.type)
    handleMouse(e.type, null)
}