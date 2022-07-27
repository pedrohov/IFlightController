const reader = require("readline-sync");
const { sleep } = require("./utils.js");
const Gpio = require("pigpio").Gpio;

const MIN_VALUE = 700;
const MAX_VALUE = 2000;

function Motor(pinNumber) {
  this.gpio = new Gpio(pinNumber, { mode: Gpio.OUTPUT });
  this.gpio.servoWrite(0);
}

Motor.prototype.calibrate = async function () {
  this.gpio.servoWrite(0);
  reader.question("Disconect the battery and press ENTER.");
  this.gpio.servoWrite(MAX_VALUE);
  reader.question("Connect the battery. Wait for two beeps and press ENTER.");
  this.gpio.servoWrite(MIN_VALUE);
  console.log("Initializing...");
  await sleep(12000);
  this.gpio.servoWrite(0);
  await sleep(2000);
  console.log("Arming ESC...");
  this.gpio.servoWrite(MIN_VALUE);
  await sleep(1000);
  console.log("Calibration finished.");
};

Motor.prototype.setSpeed = function (speed) {
  this.gpio.servoWrite(Math.min(Math.max(speed, MIN_VALUE), MAX_VALUE));
};

module.exports = { Motor, MIN_VALUE, MAX_VALUE };
