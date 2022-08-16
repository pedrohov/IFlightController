const PI_ADDRESS = "localhost";
const PI_PORT = "8954";

export enum ConnectionEvent {
  message = "message",
  open = "open",
  close = "close",
  error = "error",
}

class Connection {
  isConnected: boolean = false;
  callbacks: Record<ConnectionEvent, ((message?: any) => {})[]> = {
    [ConnectionEvent.message]: [],
    [ConnectionEvent.open]: [],
    [ConnectionEvent.close]: [],
    [ConnectionEvent.error]: [],
  };
  socket: WebSocket;

  constructor() {
    this.socket = new WebSocket(`ws:${PI_ADDRESS}:${PI_PORT}`);
    this.socket.onopen = this._onOpen.bind(this);
    this.socket.onclose = this._onClose.bind(this);
    this.socket.onerror = this._onError.bind(this);
    this.socket.onmessage = this._onMessage.bind(this);
  }

  sendMessage(message: any): void {
    if (!this.isConnected) return;
    try {
      this.socket.send(JSON.stringify(message));
    } catch {
      console.error("Could not send message", message);
    }
  }

  onMessage(callback): void {
    this.callbacks[ConnectionEvent.message].push(callback);
  }

  onOpen(callback): void {
    this.callbacks[ConnectionEvent.open].push(callback);
    this.socket.addEventListener(ConnectionEvent.open, callback);
  }

  onClose(callback): void {
    this.callbacks[ConnectionEvent.close].push(callback);
    this.socket.addEventListener(ConnectionEvent.close, callback);
  }

  onError(callback): void {
    this.callbacks[ConnectionEvent.error].push(callback);
    this.socket.addEventListener(ConnectionEvent.error, callback);
  }

  private _onOpen(ws): void {
    this.isConnected = true;
    console.log(ws, "Open connection");
  }

  private _onClose(): void {
    this.isConnected = false;
    console.log("Closed connection");
    Object.keys(this.callbacks).forEach((key) => {
      this.callbacks[key].forEach((callback) =>
        this.socket.removeEventListener("message", callback)
      );
      this.callbacks[key] = [];
    });
  }

  private _onMessage(message: MessageEvent): void {
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message.data);
    } catch {
      parsedMessage = message.data;
    }
    this.callbacks[ConnectionEvent.message].forEach((callback) =>
      callback(parsedMessage)
    );
  }

  private _onError(): void {}
}

export default Connection;
