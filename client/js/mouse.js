'use strict'

// Get a reference to an element.
const touchpad = document.getElementById('touchpad')
const vscroll = document.getElementById('vscroll')
const hscroll = document.getElementById('hscroll')

/** 
 * Cursor controller
 **/

// Handle cursor
const handleCur = (pos, action) => {
    
    if(action == 'start') {
        gsap.set('.cursor', {x: pos.x, y: pos.y, opacity: 1});
    }

    if(action == 'end') {
        gsap.set('.cursor', {opacity: 0});
    }

    if(action == 'move') {
        gsap.set('.cursor', {x: pos.x, y: pos.y})
    }

    if(['leftclick', 'rightclick', 'grab'].includes(action)) {
        gsap.set('.cursor', {
            x: pos.x,
            y: pos.y, 
            scale: 2,
            opacity: 1,
            onComplete: function () {
                gsap.to('.cursor', {duration: 0.5, opacity: 0, scale: 1})
            }
        })
    }
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

// Create an mouse instance
const mc = new Hammer.Manager(touchpad, {
    recognizers: [
        [Hammer.Pan, {direction: Hammer.DIRECTION_ALL, threshold: 5}],
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
        handleCur(e.center, 'start')
    }

    if(e.type == 'panend') {
        handleCur(null, 'end')
    }

    if(e.type == 'panmove') {
        var delta = {
            x: e.deltaX,
            y: e.deltaY
        }
        handleCur(e.center, 'move')
        handleMouse(e.type, delta)
    }
}

// Handle click events
const handleClick = (e) => {
    handleCur(e.center, e.type)
    handleMouse(e.type, null)
}



// Create an swiper instance
const sw_v = new Hammer.Manager(vscroll, {
    recognizers: [
        [Hammer.Swipe],
    ]
})

sw_v.on('swipeup swipedown', (e) => {
    console.log(e)
})