MOTOR_PINS = {
  FRONT: {
    LEFT: 18,
    RIGHT: 18,
  },
  BACK: {
    LEFT: 18,
    RIGHT: 18,
  },
};

MOTOR_SPEED_VALUES = {
  MIN: 700,
  MAX: 2000,
};

PID_CONFIG = {
  kp: 0,
  ki: 0,
  kd: 0,
};

ACCELEROMETER_OFFSET = {
  x: 0,
  y: 0,
  z: 0,
};

GYROSCOPE_OFFSET = {
  x: 0,
  y: 0,
  z: 0,
};

module.exports = {
  MOTOR_PINS,
  PID_CONFIG,
  ACCELEROMETER_OFFSET,
  GYROSCOPE_OFFSET,
};
