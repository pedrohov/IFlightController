/** Adapted from
 *  https://makersportal.com/blog/2019/11/11/raspberry-pi-python-accelerometer-gyroscope-magnetometer
 */

const i2c = require("i2c-bus");
const mpu9250 = require("../constants/mpu9250");
const { sleep } = require("../utils");

const TWO_TO_POWER_15 = 2 ** 15;

function Mpu9250() {
  this.bus = i2c.openSync(1);
  this.accelSens = 0;
  this.gyroSens = 0;
}

Mpu9250.prototype.readRawBits = function (register) {
  high = this.bus.readByteSync(mpu9250.MPU9250_ADDR, register);
  low = this.bus.readByteSync(mpu9250.MPU9250_ADDR, register + 1);

  // Combine high and low for unsigned bit value:
  let value = (high << 8) | low;

  // Convert to +- value:
  if (value > 32768) value -= 65536;

  return value;
};

Mpu9250.prototype.initialize = async function () {
  // Change sample rate. Sample rate = 8 kHz / (1 + sampleRateDiv):
  let sampleRateDiv = 0;
  this.bus.writeByteSync(
    mpu9250.MPU9250_ADDR,
    mpu9250.SMPLRT_DIV,
    sampleRateDiv
  );
  await sleep(100);

  // Reset all sensors:
  this.bus.writeByteSync(mpu9250.MPU9250_ADDR, mpu9250.PWR_MGMT_1, 0x00);
  await sleep(100);

  // Power management / crystal settings:
  this.bus.writeByteSync(mpu9250.MPU9250_ADDR, mpu9250.PWR_MGMT_1, 0x01);
  await sleep(100);

  // Write to configuration register:
  this.bus.writeByteSync(mpu9250.MPU9250_ADDR, mpu9250.CONFIG, 0);
  await sleep(100);

  // Write to Gyro configuration register:
  gyroConfigSel = [0b00000, 0b010000, 0b10000, 0b11000];
  gyroConfigVals = [250, 500, 1000, 2000]; // degrees / sec
  gyroIdx = 0;
  this.bus.writeByteSync(
    mpu9250.MPU9250_ADDR,
    mpu9250.GYRO_CONFIG,
    parseInt(gyroConfigSel[gyroIdx])
  );
  await sleep(100);

  // Write to Accel configuration register:
  accelConfigSel = [0b00000, 0b01000, 0b10000, 0b11000];
  accelConfigVals = [2, 4, 8, 16]; // g (9.81 m/s^2)
  accelIdx = 0;
  this.bus.writeByteSync(
    mpu9250.MPU9250_ADDR,
    mpu9250.ACCEL_CONFIG,
    parseInt(accelConfigSel[accelIdx])
  );
  await sleep(100);

  // Interrupt register (allow overflow of data FIFO):
  this.bus.writeByteSync(mpu9250.MPU9250_ADDR, mpu9250.INT_ENABLE, 1);
  await sleep(100);

  this.accelSens = accelConfigVals[accelIdx];
  this.gyroSens = gyroConfigVals[gyroIdx];
};

Mpu9250.prototype.readAccelerometer = function () {
  const accX = this.readRawBits(mpu9250.ACCEL_XOUT_H);
  const accY = this.readRawBits(mpu9250.ACCEL_YOUT_H);
  const accZ = this.readRawBits(mpu9250.ACCEL_ZOUT_H);

  // Convert to acceleration and degrees per second:
  const accelerationX = (accX / TWO_TO_POWER_15) * this.accelSens;
  const accelerationY = (accY / TWO_TO_POWER_15) * this.accelSens;
  const accelerationZ = (accZ / TWO_TO_POWER_15) * this.accelSens;

  return { x: accelerationX, y: accelerationY, z: accelerationZ };
};

Mpu9250.prototype.readGyroscope = function () {
  const gyroX = this.readRawBits(mpu9250.GYRO_XOUT_H);
  const gyroY = this.readRawBits(mpu9250.GYRO_YOUT_H);
  const gyroZ = this.readRawBits(mpu9250.GYRO_ZOUT_H);

  const gyroRotX = (gyroX / TWO_TO_POWER_15) * this.gyroSens;
  const gyroRotY = (gyroY / TWO_TO_POWER_15) * this.gyroSens;
  const gyroRotZ = (gyroZ / TWO_TO_POWER_15) * this.gyroSens;

  return { x: gyroRotX, y: gyroRotY, z: gyroRotZ };
};

Mpu9250.prototype.readTemperature = function () {
  return this.readRawBits(mpu9250.TEMP_OUT_H) / 340 + 21;
};

Mpu9250.prototype.read = function () {
  return {
    accelerometer: this.readAccelerometer(),
    gyroscope: this.readGyroscope(),
    temperature: this.readTemperature(),
  };
};

Mpu9250.prototype.cleanup = function () {
  this.bus.closeSync();
};

module.exports = Mpu9250;
