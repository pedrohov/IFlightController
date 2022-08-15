require("dotenv").config();
const FlightController = require("./flight-controller");
const Websocket = require("ws");

let flightController = new FlightController();

const onError = (ws, err) => {
  console.error(`Err.: ${err.message}`);
};

const onMessage = (ws, data) => {
  try {
    const msgObject = JSON.parse(data.toString());
    console.log("Message:", msgObject);
    if (msgObject["THROTTLE"]) {
      flightController.setMotorSpeed(msgObject["THROTTLE"]);
    }
  } catch {}
};

const onConnection = (ws, req) => {
  ws.on("message", (data) => onMessage(ws, data));
  ws.on("error", (error) => onError(ws, error));
  setInterval(() => {
    ws.send(flightController.getPose());
  }, 100);
  console.log("New connection");
};

async function start() {
  const websocketServer = new Websocket.Server({
    port: process.env.PORT || 8080,
  });
  websocketServer.on("connection", onConnection);
  console.log("Websocket server is running");
}

start();
