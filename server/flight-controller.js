const IMU = require("./imu/imu");
const { Motor, MAX_VALUE } = require("./motor");

function FlightController() {
  this.motor = new Motor(18);
  this.imu = new IMU();

  // Testing all motors with the same signal:
  /*console.log("Calibrating motors");
    await motor.calibrate();*/
}

FlightController.prototype.start = async function () {
  await this.imu.initialize();
};

FlightController.prototype.getPose = function () {
  this.imu.process();
  return this.imu.angles;
};

FlightController.prototype.setMotorSpeed = function (speed) {
  this.motor.setSpeed(speed * MAX_VALUE);
};

module.exports = FlightController;
