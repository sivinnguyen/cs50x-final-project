# MOBILE TOUCHPAD
A nodejs application turns your smartphone into a simple touchpad for the temporary replacement of a broken mouse. It allows you to control the mouse pointer without any 3rd-party apps installed on your phone by reaching the local address.

**Demo URL:** https://www.youtube.com/watch?v=hnFxm_wQE0k

## Installation

```bash
git clone <repo> mobile-touchpad
cd mobile-touchpad
npm install
```

To start the server with default port 3000, run
```bash
npm start
```

Or with your custom port
```bash
npm start --port=<PORT>
```

## Usage
Once the application is launched, you have to connect your device to the same local network and reach the address *http://server_address:PORT* or scan the *QR code*.

Only one device can connect to server per time.

- ```Single finger touch``` let you move the pointer
- ```Single finger tap``` let you simulate **left click**
- ```Single finger press and hold for 1sec``` let you simulate **right click**
- ```Double finger tap``` to simulate **button pressed**. ```Single finger tap``` or ```Double finger tap``` again will **release button**
- ```Swipe at the right edge``` to **scroll up/down**
- ```Swipe at the left edge``` to **scroll left/right**
