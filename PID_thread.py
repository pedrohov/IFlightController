from mpu_thread    import *;
from async_server  import *;
from motor_control import *;
from threading     import Thread;

class PID(Thread):
    """ Class that handles the PID for PITCH and ROLL.
        This class has an instance for both the server and the motion unit.
        It constantly recalculates the speed for each motor given the Process Variable (PV)
        obtained from the MPU, and the Setpoint (SP) obtained from the server.
        The output is each motor's speed given in us (microseconds).
    """
    
    def __init__(self):
        
        Thread.__init__(self);
        
        # MPU thread to access Pitch and Row angles:
        self.MPU = MPU(0x68);
        
        # Motor control instance for setting the speed:
        self.controller = MotorControl();
        
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
            if(self.receiver.hasMessage()):
                message = self.receiver.getMessage();
                print(message);
                #print(message['controllerLeft']['x']);

        # Clean dead ends before ending:

        
if __name__ == "__main__":
    fc = PID().start();
    