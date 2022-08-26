const { PID_CONFIG } = require("./config");

function PID() {
  this.kp = PID_CONFIG.kp;
  this.ki = PID_CONFIG.ki;
  this.kd = PID_CONFIG.kd;

  this.p = 0;
  this.i = 0;
  this.d = 0;

  this.previousError = 0;
  this.sumError = 0;
  this.lastComputationTime = process.hrtime();
}

PID.prototype.compute = function (setpoint, processVal) {
  const error = processVal - setpoint;
  const deltaTimeArr = process.hrtime(this.lastComputationTime);
  const dt = deltaTimeArr[0] * 1e9 + deltaTimeArr[1];
  this.lastComputationTime = deltaTimeArr;

  this.p = this.kp * error;
  this.i = this.sumError + this.p * this.ki * dt;
  this.d = this.kd * ((error - this.previousError) / dt);

  this.sumError += this.i;
  this.previousError = error;

  return this.p + this.i + this.d;
};

module.exports = PID;
