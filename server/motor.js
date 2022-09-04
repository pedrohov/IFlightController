const reader = require("readline-sync");
const { sleep } = require("./utils.js");
const Gpio = require("pigpio").Gpio;
const { MOTOR_SPEED_VALUES } = require("./config");

function Motor(pinNumber) {
  this.gpio = new Gpio(pinNumber, { mode: Gpio.OUTPUT });
  this.gpio.servoWrite(0);
}

Motor.prototype.calibrate = async function () {
  this.gpio.servoWrite(0);
  reader.question("Disconect the battery and press ENTER.");
  this.gpio.servoWrite(MOTOR_SPEED_VALUES.MAX);
  reader.question("Connect the battery. Wait for two beeps and press ENTER.");
  this.gpio.servoWrite(MOTOR_SPEED_VALUES.MIN);
  console.log("Initializing...");
  await sleep(12000);
  this.gpio.servoWrite(0);
  await sleep(2000);
  console.log("Arming ESC...");
  this.gpio.servoWrite(MOTOR_SPEED_VALUES.MIN);
  await sleep(1000);
  console.log("Calibration finished.");
};

Motor.prototype.setSpeed = function (speed) {
  this.gpio.servoWrite(
    Math.min(Math.max(speed, MOTOR_SPEED_VALUES.MIN), MOTOR_SPEED_VALUES.MAX)
  );
};

export default Motor;
