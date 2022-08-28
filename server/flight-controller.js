const { MOTOR_PINS } = require("./config");
const IMU = require("./imu/imu");
const Motor = require("./motor");
const PID = require("./pid");

function FlightController() {
  this.imu = new IMU();

  this.motors = {
    FRONT: {
      RIGHT: new Motor(MOTOR_PINS.FRONT.RIGHT),
      LEFT: new Motor(MOTOR_PINS.FRONT.LEFT),
    },
    BACK: {
      RIGHT: new Motor(MOTOR_PINS.BACK.RIGHT),
      LEFT: new Motor(MOTOR_PINS.BACK.LEFT),
    },
  };

  this.pids = {
    GYRO_RATE_X: new PID(),
    GYRO_RATE_Y: new PID(),
    GYRO_RATE_Z: new PID(),
    ANGLE_X: new PID(),
    ANGLE_Y: new PID(),
  };

  this.input = {
    THROTTLE: 0,
    ROLL: 0,
    PITCH: 0,
    YAW: 0,
  };
}

FlightController.prototype.start = async function () {
  await this.imu.initialize();
};

FlightController.prototype.getPose = function () {
  return this.imu.angles;
};

FlightController.prototype.updateInput = function (inputReadings) {
  this.input = inputReadings;
};

FlightController.prototype.computePIDs = function () {
  this.pids.GYRO_RATE_X.process(this.input.PITCH, this.imu.gyroscopeRates.x);
  this.pids.GYRO_RATE_Y.process(this.input.ROLL, this.imu.gyroscopeRates.y);
  this.pids.GYRO_RATE_Z.process(this.input.YAW, this.imu.gyroscopeRates.z);

  this.pids.ANGLE_X.process(this.input.PITCH, this.imu.angles.x);
  this.pids.ANGLE_Y.process(this.input.ROLL, this.imu.angles.y);
};

FlightController.prototype.updateMotors = function () {
  this.motors.FRONT.RIGHT =
    this.input.THROTTLE -
    this.pids.GYRO_RATE_X.output -
    this.pids.GYRO_RATE_Y.output +
    this.pids.GYRO_RATE_Z.output;

  this.motors.FRONT.LEFT =
    this.input.THROTTLE +
    this.pids.GYRO_RATE_X.output -
    this.pids.GYRO_RATE_Y.output -
    this.pids.GYRO_RATE_Z.output;

  this.motors.BACK.RIGHT =
    this.input.THROTTLE -
    this.pids.GYRO_RATE_X.output +
    this.pids.GYRO_RATE_Y.output -
    this.pids.GYRO_RATE_Z.output;

  this.motors.BACK.LEFT =
    this.input.THROTTLE +
    this.pids.GYRO_RATE_X.output +
    this.pids.GYRO_RATE_Y.output +
    this.pids.GYRO_RATE_Z.output;
};

FlightController.prototype.process = function () {
  this.imu.process();
  this.computePIDs();
  this.updateMotors();
};

FlightController.prototype.calibrateMotors = function () {
  // Testing all motors with the same signal:
  /*console.log("Calibrating motors");
    await motor.calibrate();*/
};

module.exports = FlightController;
