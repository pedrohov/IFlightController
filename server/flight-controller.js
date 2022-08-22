const Mpu9250 = require("./imu/mpu9250");
const { Motor, MAX_VALUE } = require("./motor");

function FlightController() {
  this.motor = new Motor(18);
  this.mpu9250 = new Mpu9250();

  // Testing all motors with the same signal:
  /*console.log("Calibrating motors");
    await motor.calibrate();*/
}

FlightController.prototype.start = async function() {
  await this.mpu9250.start();
};

FlightController.prototype.getPose = function() {
  return this.mpu9250.read();
};

FlightController.prototype.setMotorSpeed = function(speed) {
  this.motor.setSpeed(speed * MAX_VALUE);
};

module.exports = FlightController;
