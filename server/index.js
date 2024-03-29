require("dotenv").config();
const FlightController = require("./flight-controller");
const Websocket = require("ws");
const checkDiskSpace = require("check-disk-space").default;

let flightController = new FlightController();

const MessageParser = {
  controller_input: (ws, msg) => flightController.updateInput(msg),
  calibration: (ws, msg) => {
    ws.send(JSON.stringify({ type: "calibration", status: "in_progress" }));
    flightController.calibrateMotors().then(() => {
      ws.send(JSON.stringify({ type: "calibration", status: "done" }));
    });
  },
};

const onError = (ws, err) => {
  console.error(`Err.: ${err.message}`);
};

const onMessage = (ws, data) => {
  try {
    const msgObject = JSON.parse(data.toString());
    MessageParser[msgObject.type](ws, msgObject);
  } catch {}
};

const onConnection = (ws, req) => {
  ws.on("message", (data) => onMessage(ws, data));
  ws.on("error", (error) => onError(ws, error));
  setInterval(async () => {
    const diskSpace = await checkDiskSpace("/");
    const pose = flightController.getPose();
    ws.send(JSON.stringify({ pose, diskSpace }));
  }, 200);
  console.log("New connection");
};

async function start() {
  await flightController.start();

  setInterval(() => {
    flightController.process();
  });

  const websocketServer = new Websocket.Server({
    port: process.env.PORT || 8080,
  });
  websocketServer.on("connection", onConnection);
  console.log("Websocket server is running");
}

start();
