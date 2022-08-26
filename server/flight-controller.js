const IMU = require("./imu/imu");
const { Motor, MAX_VALUE } = require("./motor");
const PID = require("./pid");

function FlightController() {
  this.motor = new Motor(18);
  this.imu = new IMU();

  // Testing all motors with the same signal:
  /*console.log("Calibrating motors");
    await motor.calibrate();*/

  this.pids = {
    GYRO_RATE_X: new PID(),
    GYRO_RATE_Y: new PID(),
    GYRO_RATE_Z: new PID(),
    ANGLE_X: new PID(),
    ANGLE_Y: new PID(),
  };
}

FlightController.prototype.start = async function () {
  await this.imu.initialize();
};

FlightController.prototype.getPose = function () {
  return this.imu.angles;
};

FlightController.prototype.computePIDs = function () {
  // TODO: Read input from the controller:
  const input = { PITCH: 0, ROLL: 0, YAW: 0 };
  this.pids.GYRO_RATE_X.process(input.PITCH, this.imu.gyroscopeRates.x);
  this.pids.GYRO_RATE_Y.process(input.ROLL, this.imu.gyroscopeRates.y);
  this.pids.GYRO_RATE_Z.process(input.YAW, this.imu.gyroscopeRates.z);

  this.pids.ANGLE_X.process(input.PITCH, this.imu.angles.x);
  this.pids.ANGLE_Y.process(input.ROLL, this.imu.angles.y);
};

FlightController.prototype.process = function () {
  this.imu.process();
  this.computePIDs();
};

FlightController.prototype.setMotorSpeed = function (speed) {
  this.motor.setSpeed(speed * MAX_VALUE);
};

module.exports = FlightController;
