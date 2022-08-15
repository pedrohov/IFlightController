const Mpu9250 = require("./imu/mpu9250");
const { Motor, MAX_VALUE } = require("./motor");

function FlightController() {
  this.motor = new Motor(18);

  // Testing all motors with the same signal:
  /*console.log("Calibrating motors");
    await motor.calibrate();*/

  console.log("Initializing Mpu9250");
  this.mpu9250 = new Mpu9250();
}

FlightController.prototype.start = async () => {
  await mpu9250.start();
};

FlightController.prototype.getPose = () => {
  const mpuData = this.mpu9250.read();
  console.log(mpuData);
  return mpuData;
};

FlightController.prototype.setMotorSpeed = (speed) => {
  this.motor.setSpeed(speed * MAX_VALUE);
};

module.exports = FlightController;
