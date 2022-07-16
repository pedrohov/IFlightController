const Gpio = require('onoff').Gpio
const led = new Gpio(18, 'out')
let lightup = false

setInterval(() => {
	led.writeSync(lightup ? 1 : 0)
	lightup = !lightup
}, 1000)
