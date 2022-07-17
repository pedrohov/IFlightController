/** Adapted from
 *  https://makersportal.com/blog/2019/11/11/raspberry-pi-python-accelerometer-gyroscope-magnetometer
 */

const i2c = require("i2c-bus");

const MPU9250_ADDR = 0x68; // to locate the address: sudo i2cdetect -y 1
const AK8963_ADDR = 0x0c;

const PWR_MGMT_1 = 0x6b,
  SMPLRT_DIV = 0x6b,
  CONFIG = 0x1a,
  GYRO_CONFIG = 0x1b,
  ACCEL_CONFIG = 0x1c,
  INT_ENABLE = 0x38;
const ACCEL_XOUT_H = 0x3b,
  ACCEL_YOUT_H = 0x3d,
  ACCEL_ZOUT_H = 0x3f;
const GYRO_XOUT_H = 0x43,
  GYRO_YOUT_H = 0x45,
  GYRO_ZOUT_H = 0x47;

const AK8963_CNTL = 0x0a,
  AK8963_ST2 = 0x09,
  AK8963_ASAX = 0x10;
const HXH = 0x04,
  HYH = 0x06,
  HZH = 0x08;
const MAGNETOMETER_SENSITIVITY = 4900; // 4800 uT

const TWO_TO_POWER_15 = 2 ** 15;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readRawBits(register) {
  high = i2c1.readByteSync(MPU9250_ADDR, register);
  low = i2c1.readByteSync(MPU9250_ADDR, register + 1);

  // Combine high and low for unsigned bit value:
  let value = (high << 8) | low;

  // Convert to +- value:
  if (value > 32768) value -= 65536;

  return value;
}

function AK8963reader(register) {
  low = i2c1.readByteSync(AK8963_ADDR, register - 1);
  high = i2c1.readByteSync(AK8963_ADDR, register);

  // Combine high and low for unsigned bit value:
  let value = (high << 8) | low;

  // Convert to +- value:
  if (value > 32768) value -= 65536;

  return value;
}

async function start() {
  // Change sample rate. Sample rate = 8 kHz / (1 + sampleRateDiv):
  let sampleRateDiv = 0;
  i2c1.writeByteSync(MPU9250_ADDR, SMPLRT_DIV, sampleRateDiv);
  await sleep(100);

  // Reset all sensors:
  i2c1.writeByteSync(MPU9250_ADDR, PWR_MGMT_1, 0x00);
  await sleep(100);

  // Power management / crystal settings:
  i2c1.writeByteSync(MPU9250_ADDR, PWR_MGMT_1, 0x01);
  await sleep(100);

  // Write to configuration register:
  i2c1.writeByteSync(MPU9250_ADDR, CONFIG, 0);
  await sleep(100);

  // Write to Gyro configuration register:
  gyroConfigSel = [0b00000, 0b010000, 0b10000, 0b11000];
  gyroConfigVals = [250, 500, 1000, 2000]; // degrees / sec
  gyroIdx = 0;
  i2c1.writeByteSync(
    MPU9250_ADDR,
    GYRO_CONFIG,
    parseInt(gyroConfigSel[gyroIdx])
  );
  await sleep(100);

  // Write to Accel configuration register:
  accelConfigSel = [0b00000, 0b01000, 0b10000, 0b11000];
  accelConfigVals = [2, 4, 8, 16]; // g (9.81 m/s^2)
  accelIdx = 0;
  i2c1.writeByteSync(
    MPU9250_ADDR,
    ACCEL_CONFIG,
    parseInt(accelConfigSel[accelIdx])
  );
  await sleep(100);

  // Interrupt register (allow overflow of data FIFO):
  i2c1.writeByteSync(MPU9250_ADDR, INT_ENABLE, 1);
  await sleep(100);

  // Start AK8963:
  i2c1.writeByteSync(AK8963_ADDR, AK8963_CNTL, 0x00);
  await sleep(100);
  const AK8963bitRes = 0b0001; // 0b0001 = 16-bit
  const AK8963sampRate = 0b0110; // 0b0010 = 8 Hz, 0b0110 = 100 Hz
  const AK8963mode = (AK8963bitRes << 4) + AK8963sampRate; // bit conversion
  i2c1.writeByteSync(AK8963_ADDR, AK8963_CNTL, AK8963mode);
  await sleep(100);

  return {
    gyroSens: gyroConfigVals[gyroIdx],
    accelSens: accelConfigVals[accelIdx],
  };
}

function conv() {
  const accX = readRawBits(ACCEL_XOUT_H);
  const accY = readRawBits(ACCEL_YOUT_H);
  const accZ = readRawBits(ACCEL_ZOUT_H);

  const gyroX = readRawBits(GYRO_XOUT_H);
  const gyroY = readRawBits(GYRO_YOUT_H);
  const gyroZ = readRawBits(GYRO_ZOUT_H);

  // Convert to acceleration and degrees per second:
  const accelerationX = (accX / TWO_TO_POWER_15) * accelSens;
  const accelerationY = (accY / TWO_TO_POWER_15) * accelSens;
  const accelerationZ = (accZ / TWO_TO_POWER_15) * accelSens;

  const gyroRotX = (gyroX / TWO_TO_POWER_15) * gyroSens;
  const gyroRotY = (gyroY / TWO_TO_POWER_15) * gyroSens;
  const gyroRotZ = (gyroZ / TWO_TO_POWER_15) * gyroSens;

  return {
    accel: { x: accelerationX, y: accelerationY, z: accelerationZ },
    gyro: { x: gyroRotX, y: gyroRotY, z: gyroRotZ },
  };
}

function AK8963conv() {
  let magX, magY, magZ;
  while (true) {
    magX = AK8963reader(HXH);
    magY = AK8963reader(HYH);
    magZ = AK8963reader(HZH);
    if (i2c1.readByteSync(AK8963_ADDR, AK8963_ST2) == 0b10000) break;
  }

  const magnitudeX = (magX / TWO_TO_POWER_15) * MAGNETOMETER_SENSITIVITY;
  const magnitudeY = (magY / TWO_TO_POWER_15) * MAGNETOMETER_SENSITIVITY;
  const magnitudeZ = (magZ / TWO_TO_POWER_15) * MAGNETOMETER_SENSITIVITY;

  return { x: magnitudeX, y: magnitudeY, z: magnitudeZ };
}

function logDebugValues(accelGyro, magnetometer) {
  console.clear();
  console.log(
    `ACCE\tx: ${accelGyro.accel.x}\ty: ${accelGyro.accel.y}\tz: ${accelGyro.accel.z}\nGYRO\tx: ${accelGyro.gyro.x}\ty: ${accelGyro.gyro.y}\tz: ${accelGyro.gyro.z}\nMAGN\tx: ${magnetometer.x}\ty: ${magnetometer.y}\tz: ${magnetometer.z}`
  );
}

async function main() {
  const sens = await start();
  accelSens = sens.accelSens;
  gyroSens = sens.gyroSens;

  let readings;
  while (true) {
    readings = conv();
    //magnetometerReadings = AK8963conv();
    magnetometerReadings = { x: 0, y: 0, z: 0 };
    logDebugValues(readings, magnetometerReadings);
  }
}

let accelSens = 0,
  gyroSens = 0;
const i2c1 = i2c.openSync(1);
main();
i2c1.closeSync();
