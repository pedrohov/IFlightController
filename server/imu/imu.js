const Mpu9250 = require("./mpu9250");

const RAD_TO_DEG = 180 / Math.PI;
const GYROSCOPE_RATIO = 0.994;
const ACCELEROMETER_RATIO = 1 - GYROSCOPE_RATIO;

function IMU() {
  this.mpu9250 = new Mpu9250();
  this.angles = { x: 0, y: 0 };
  this.gyroscopeRates = { x: 0, y: 0, z: 0 };
  this.combineUpdateTimer = process.hrtime()[0] * 0.001;
  this.gyroscopeRatesUpdateTimer = process.hrtime()[0] * 0.001;
}

IMU.prototype.initialize = async function () {
  await this.mpu9250.initialize();
};

IMU.prototype.processRawData = function () {
  const gyroscopeData = this.mpu9250.readGyroscope();
  const dt =
    (process.hrtime()[0] * 0.001 - this.gyroscopeRatesUpdateTimer) * 0.000001;

  const rc = 1 / (160 * Math.PI); // 160 = 80Hz * 2

  this.gyroscopeRates.x +=
    (dt / (rc + dt)) * (gyroscopeData.x - this.gyroscopeRates.x);
  this.gyroscopeRates.y +=
    (dt / (rc + dt)) * (gyroscopeData.y - this.gyroscopeRates.y);
  this.gyroscopeRates.z +=
    (dt / (rc + dt)) * (gyroscopeData.z - this.gyroscopeRates.z);

  this.gyroscopeRatesUpdateTimer = process.hrtime()[0] * 0.001;
};

IMU.prototype.combine = function () {
  const accelerometerData = this.mpu9250.readAccelerometer();
  const dt = (process.hrtime()[0] * 0.001 - this.combineUpdateTimer) * 0.000001;
  this.combineUpdateTimer = process.hrtime()[0] * 0.001;

  const accAngles = {
    x: Math.atan2(accelerometerData.y, accelerometerData.z) * RAD_TO_DEG,
    y:
      Math.atan2(
        accelerometerData.x * -1,
        Math.sqrt(
          accelerometerData.y * accelerometerData.y +
            accelerometerData.z * accelerometerData.z
        )
      ) * RAD_TO_DEG,
  };

  this.angles = {
    x:
      GYROSCOPE_RATIO * (this.angles.x + this.gyroscopeRates.x * dt) +
      ACCELEROMETER_RATIO * accAngles.x,
    y:
      GYROSCOPE_RATIO * (this.angles.y + this.gyroscopeRates.y * dt) +
      ACCELEROMETER_RATIO * accAngles.y,
  };
};

IMU.prototype.process = function () {
  this.processRawData();
  this.combine();
};

module.exports = IMU;
