const PI_ADDRESS = "localhost";
const PI_PORT = "8080";

let socket = new WebSocket("ws:" + PI_ADDRESS + ":" + PI_PORT);
let isConnected: boolean = false;
let callbacks: (() => {})[] = [];

socket.onopen = (ws) => {
  isConnected = true;
  console.log("Open connection");
};
socket.onclose = () => {
  isConnected = false;
  console.log("Closed connection");
  callbacks.forEach((callback) =>
    socket.removeEventListener("message", callback)
  );
  callbacks = [];
};

export const sendMessage = (message: any): void => {
  if (!isConnected) return;
  try {
    socket.send(JSON.stringify(message));
  } catch {
    console.error("Could not send message", message);
  }
};

export const onMessage = (callback) => {
  callbacks.push(callback);
  socket.addEventListener("message", callback);
};
