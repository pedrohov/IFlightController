const readline = require('readline');
const Gpio = require('pigpio').Gpio;

const motor = new Gpio(18, {mode: Gpio.OUTPUT});
const MIN_VALUE = 700;
const MAX_VALUE = 2000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function calibrate() {
	const rl = readline.createInterface({input: process.stdin, output: process.stdout});
	motor.servoWrite(0);
	rl.question("Disconect the battery and press ENTER.", () => {
		motor.servoWrite(MAX_VALUE);
		rl.question("Connect the battery. Wait for two beeps and press ENTER.", async () => {
			rl.close();
			motor.servoWrite(MIN_VALUE);
			console.log("Wait...");
			await sleep(12000);
			motor.servoWrite(0);
			await sleep(2000);
			console.log("Arming ESC...");
			motor.servoWrite(MIN_VALUE);
			await sleep(1000);
			console.log("Calibration finished.");
			setInterval(() => {
				motor.servoWrite(1000);
			}, 10000)
		})
	})
}

calibrate();
