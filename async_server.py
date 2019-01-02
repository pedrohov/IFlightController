import asyncio;
import websockets;
import json;

class Receiver():

    def __init__(self, ip, port):
        
        self.received_message = None;
        self.received_state   = 'normal';
        
        self.ip     = ip;
        self.port   = port;
        self.server = None;
        
    def start(self):
        self.server = websockets.serve(self.receiver, self.ip, self.port);
        asyncio.get_event_loop().run_until_complete(self.server);
        asyncio.get_event_loop().run_forever();
        
    async def receiver(self, websocket, path):
        while True:
            try:
                message = await websocket.recv();
                message = json.loads(message);
                print(message);

                # Set state to changed:
                self.state = 'changed';
                self.message = message;

            except json.decoder.JSONDecodeError:
                continue;
        
if __name__ == '__main__':
    receiver = Receiver('localhost', 8080);
    receiver.start();