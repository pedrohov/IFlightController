require("dotenv").config();
const Websocket = require("ws");

const onError = (ws, err) => {
  console.error(`Err.: ${err.message}`);
};

const onMessage = (ws, data) => {
  console.log("Message:", data.toString());
};

const onConnection = (ws, req) => {
  ws.on("message", (data) => onMessage(ws, data));
  ws.on("error", (error) => onError(ws, error));
  console.log("New connection");
};

const websocketServer = new Websocket.Server({
  port: process.env.PORT || 8080,
});
websocketServer.on("connection", onConnection);
console.log("Websocket server is running");
