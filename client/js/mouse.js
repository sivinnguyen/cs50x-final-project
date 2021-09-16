'use strict'

// Get a reference to an element.
const touchpad = document.getElementById('touchpad')
const cursor = document.getElementById('cursor')


// Cursor controller
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


// Create an instance of Hammer
const mc = new Hammer.Manager(touchpad, {
    recognizers: [
        [Hammer.Pan, {direction: Hammer.DIRECTION_ALL, threshold: 0}]
    ]
})

// Subscribe to events
mc.on('panstart panend panmove', (e) => {
    handlePan(e)
})

// Handle pan event
const handlePan = (e) => {
    if(e.type == 'panstart') {
        console.log(e)
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
    }
}