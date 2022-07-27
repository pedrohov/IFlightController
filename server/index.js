require("dotenv").config();
const Mpu9250 = require("./imu/mpu9250");
const { Motor, MAX_VALUE } = require("./motor");
const Websocket = require("ws");

let motor;

const onError = (ws, err) => {
  console.error(`Err.: ${err.message}`);
};

const onMessage = (ws, data) => {
  try {
    const msgObject = JSON.parse(data.toString());
    console.log("Message:", msgObject);
    if (msgObject["THROTTLE"]) {
      motor.setSpeed(msgObject["THROTTLE"] * MAX_VALUE);
    }
  } catch {}
};

const onConnection = (ws, req) => {
  ws.on("message", (data) => onMessage(ws, data));
  ws.on("error", (error) => onError(ws, error));
  console.log("New connection");
};

async function start() {
  console.log("Initializing Mpu9250");
  const mpu9250 = new Mpu9250();
  await mpu9250.start();
  console.log("ACCE:", mpu9250.readAccelerometer());
  console.log("GYRO:", mpu9250.readGyroscope());
  console.log("TEMP:", mpu9250.readTemperature());

  // Testing all motors with the same signal:
  motor = new Motor(18);
  /*console.log("Calibrating motors");
  await motor.calibrate();*/

  const websocketServer = new Websocket.Server({
    port: process.env.PORT || 8080,
  });
  websocketServer.on("connection", onConnection);
  console.log("Websocket server is running");
}

start();
