from mpu_thread import *;
from async_server import *;
from threading import Thread;

class FlightController(Thread):
    """ """
    
    def __init__(self):
        
        Thread.__init__(self);
        
        # MPU thread to access Pitch and Row angles:
        self.MPU = MPU(0x68);
        
        # Motor control:
        self.controller = None;
        
        # Static Setpoint for Pitch and Row,
        # specified in degrees:
        self.setpoint = {PITCH: 0, ROLL: 0};
        
        # Server instance to receive data from the controller.
        # Listen to the wlan0 IP, at port 8080:
        self.receiver = Receiver('', 8080);
        
        # Start the application:
        self.start();
        
        # Start listening to the websocket:
        self.receiver.start();
        
        
    def run(self):
        self.MPU.start();
        
        while(True):
            print("AHHHHHHHHHHH")
        
        
##    def start(self):
        # Run server:
        #self.receiver.run();
        
        # Run MPU:
##        self.MPU.run();
        
##        self.start();
    
    def loop(self):
        pass;
        
if __name__ == "__main__":
    fc = FlightController().start();
    