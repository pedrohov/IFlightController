from mpu_thread    import *;
from async_server  import *;
from motor_control import *;
from threading     import Thread;

class PIDcontroller():
    """ Class for calculating the output of each motor.
        It receives the setpoint (SP) and the process variable (PV)
        to calculate the error.
        The output is each motor's speed given in us (microseconds).
    """
    def __init__(self, kP, kI, kD):
        # PID previous value:
        self.P = 0;
        self.I = 0;
        self.D = 0;
        
        # PID constants:
        self.kP = kP;
        self.kI = kI;
        self.kD = kD;
        
        # Previous error:
        self.previous_error = 0;
        
    def PID(self, setpoint, process_var, elapsed_time):
        
        # Calculate the error:
        error = process_var - setpoint;
        
        # Proportional value. Constant multiplied by the error:
        self.P = self.kP * error;
        
        # Integrate the value of the error, sum of the previous
        # integral part plus the error multiplied by its constant.
        # The integral part will only act when the error is close
        # to the setpoint (+- 3 degrees):
        if(error > -3) and (error < 3):
            self.I = self.I + (self.kI * error);
        
        # The derivate is the value of the error given in the amount
        # of time passed since the last iteration:
        self.D = self.kD * ((error - self.previous_error) / elapsed_time);
        self.previous_error = error;
        
        # The PID value is the sum of each part:
        PID = self.P + self.I + self.D;
        
        # Treat the PID value so it isn't bigger than 2000us and
        # less than 1000us (MAX and MIN calibrated for the ESCs):
        if(PID < (-1 * MIN_SPEED)):
            PID = -1 * MIN_SPEED;
        elif(PID > MIN_SPEED):
            PID = MIN_SPEED;
            
        return PID;
        

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
        
        # Motor control instance for setting the speed:
        self.controller = MotorControl();
        
        # Static Setpoint for Pitch and Row,
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
        self.MPU.start();
        now = time.time();
        
        while(True):
            previous_time = now;
            
            # Get new SP values from the controller:
            if(self.receiver.hasMessage()):
                message = self.receiver.getMessage();
                self.update_setpoint(message);
                #print(message);
            
            # Calculate the PITCH PID:
            now = time.time();
            elapsed_time = now - previous_time;
            PID = self.pitch_PID.PID(float(self.setpoint[PITCH]),
                                     self.MPU.angle[PITCH],
                                     elapsed_time);
            
            # Calculate the actual PITCH speed (Throttle + PID):
            speed = self.setpoint[THROTTLE] + PID;
            # print('PITCH SPD: ' + str(speed));
            
            # Define motor speed for the PITCH:
            # self.controller.setSpeed(speed, CCW1);
            # self.controller.setSpeed(speed, CCW2);
            
            # Calculate the ROLL PID:
            # Calculate the actual  speed (Throttle + PID):
            # Define motor speed for the ROLL:

        # Clean dead ends before ending:
        # self.controller.cleanup();
    
    def update_setpoint(self, message):
        # self.setpoint[PITCH] = message[];
        # self.setpoint[ROLL] = message[];
        # self.setpoint[YAW] = message[];
        
        # Read throttle value from the controller:
        value = float(message['controllerLeft']['y']);
        if(value == 0):
            self.setpoint[THROTTLE] = MIN_SPEED;
        else:
            self.setpoint[THROTTLE] = abs(value * MAX_SPEED);
        
if __name__ == "__main__":
    fc = FlightController().start();
    