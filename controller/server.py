import asyncio;
import websockets;

async def time(websocket, path):
    while True:
        message = await websocket.recv();
        try:
        	data = json.loads(message);
        	print(data);
        except json.decoder.JSONDecodeError:
        	print(message);

start_server = websockets.serve(time, '127.0.0.1', 8080);

asyncio.get_event_loop().run_until_complete(start_server);
asyncio.get_event_loop().run_forever();00,