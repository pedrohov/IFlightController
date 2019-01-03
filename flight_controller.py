from MPU            import *;
from receiver       import *;
from motor_control  import *;
from PID_controller import *;
from threading      import Thread;      

class FlightController(Thread):
    """ Class that handles the PID for PITCH and ROLL.
        This class has an instance for both the server and the motion unit.
        It constantly recalculates the speed for each motor given the PV
        obtained from the MPU, and the SP obtained from the server.
    """
    def __init__(self):
        
        Thread.__init__(self);
        
        # MPU thread to access Pitch and Row angles:
        self.MPU = MPU(0x68);
        
        # PID controllers:
        self.pitch_PID = PIDcontroller(3.55, 0.005, 2.05);
        self.roll_PID  = PIDcontroller(3.55, 0.005, 2.05);
        self.yaw_PID   = None;
        
        # Motor control instance for setting the speed:
        self.controller = MotorControl();
        
        # Static Setpoint for Pitch, Roll, Yaw and Throttle,
        # specified in degrees:
        self.setpoint = {PITCH: 0, ROLL: 0, YAW: 0, THROTTLE: 1000};
        
        # Server instance to receive data from the controller.
        # Listen to the wlan0 IP, at port 8080:
        self.receiver = Receiver('', 8080);
        
        # Start the application:
        self.start();
        
        # Start listening to the websocket:
        self.receiver.start();
        
        
    def run(self):
        """ Core loop of the flight controller.
            The thread gets information from the Receiver and the MPU,
            calculates and sets the speed of each motor.
        """

        # Start reading MPU data:
        self.MPU.start();

        # Delay for 2s to get better values from the MPU:
        time.sleep(2);

        # Get current time:
        now = time.time();
        
        while(True):
            previous_time = now;
            
            # Get new SP values from the controller:
            if(self.receiver.hasMessage()):
                message = self.receiver.getMessage();
                self.updateSetpoint(message);
                #print(message);
            
            # Calculate the PITCH PID:
            now = time.time();
            elapsed_time = now - previous_time;
            PID = self.pitch_PID.PID(self.setpoint[PITCH], self.MPU.angle[PITCH], elapsed_time);
            
            # Calculate the actual PITCH speed (Throttle + PID):
            speed = self.setpoint[THROTTLE] + PID;
            # print('PITCH SPD: ' + str(speed));
            
            # Define motor speed for the PITCH:
            # self.controller.setSpeed(speed, CCW1);
            # self.controller.setSpeed(speed, CCW2);
            
            # Calculate the ROLL PID:
            now = time.time();
            elapsed_time = now - previous_time;
            PID = self.roll_PID.PID(self.setpoint[PITCH], self.MPU.angle[PITCH], elapsed_time);

            # Calculate the actual  speed (Throttle + PID):
            speed = self.setpoint[THROTTLE] + PID;
            # print('ROLL SPD: ' + str(speed));

            # Define motor speed for the ROLL:
            # self.controller.setSpeed(speed, CW1);
            # self.controller.setSpeed(speed, CW2);

        # Clean dead ends before ending:
        # self.controller.cleanup();
    
    def updateSetpoint(self, message):
        # self.setpoint[PITCH] = message[];
        # self.setpoint[ROLL]  = message[];
        # self.setpoint[YAW]   = message[];
        
        # Read throttle value from the controller:
        value = float(message['controllerLeft']['y']);
        if(value == 0):
            self.setpoint[THROTTLE] = MIN_SPEED;
        else:
            self.setpoint[THROTTLE] = abs(value * MAX_SPEED);
        
if __name__ == "__main__":
    fc = FlightController().start();
    