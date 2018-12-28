import asyncio;
import websockets;
import json;

async def time(websocket, path):
    while True:
        try:
            message = json.loads(await websocket.recv());
            print(message);
        except json.decoder.JSONDecodeError:
            print(message);
        
start_server = websockets.serve(time, '', 8080);

asyncio.get_event_loop().run_until_complete(start_server);
asyncio.get_event_loop().run_forever();