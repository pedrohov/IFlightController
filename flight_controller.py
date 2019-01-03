from MPU            import *;
from receiver       import *;
from motor_control  import *;
from PID_controller import *;
from threading      import Thread;

# Limit allowed for the quad to tilt:
MAX_PITCH_ANGLE = 20;
MAX_ROLL_ANGLE  = 20;
MAX_YAW_ANGLE   = 180;

# Quadcopter configurations (x, +, H):
PLUS_CONFIG = 'PLUS_CONFIG';
X_CONFIG    = 'X_CONFIG';
QUAD_CONFIG = X_CONFIG;

class FlightController(Thread):
    """ Class that handles the PID for PITCH and ROLL.
        This class has an instance for both the server and the motion unit.
        It constantly recalculates the speed for each motor given the PV
        obtained from the MPU, and the SP obtained from the server.
    """
    def __init__(self, config):
        
        Thread.__init__(self);

        self.config = config;
        
        # MPU thread to access Pitch and Row angles:
        self.MPU = MPU(0x68);
        
        # PID controllers:
        self.pitch_PID = PIDcontroller(self.config[QUAD_CONFIG]['PITCH']['kP'],
                                       self.config[QUAD_CONFIG]['PITCH']['kI'],
                                       self.config[QUAD_CONFIG]['PITCH']['kD']);
        self.roll_PID  = PIDcontroller(self.config[QUAD_CONFIG]['ROLL']['kP'],
                                       self.config[QUAD_CONFIG]['ROLL']['kI'],
                                       self.config[QUAD_CONFIG]['ROLL']['kD']);
        self.yaw_PID   = PIDcontroller(self.config[QUAD_CONFIG]['YAW']['kP'],
                                       self.config[QUAD_CONFIG]['YAW']['kI'],
                                       self.config[QUAD_CONFIG]['YAW']['kD']);
        
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
            pitch_PID = self.pitch_PID.PID(self.setpoint[PITCH], self.MPU.angle[PITCH], elapsed_time);
            
            # Calculate the ROLL PID:
            now = time.time();
            elapsed_time = now - previous_time;
            roll_PID = self.roll_PID.PID(self.setpoint[PITCH], self.MPU.angle[PITCH], elapsed_time);

            # Calculate the YAW PID [NOT IMPLEMENTED]:
            yaw_PID = 0;
            
            # Calculate and set the speed of each motor:
            self.setMotorsSpeed(self.setpoint[THROTTLE], pitch_PID, roll_PID, yaw_PID);

        # Clean dead ends before ending:
        self.controller.cleanup();

    def setMotorsSpeed(self, throttle, pitch, roll, yaw):

        # X CONFIG:
        if(QUAD_CONFIG == X_CONFIG):
            
            # CW1  = Throttle + Pitch + Roll - Yaw:
            spd = throttle + pitch + roll - yaw;
            self.controller.setSpeed(spd, CW1_MOTOR);

            # CCW1 = Throttle + Pitch - Roll + Yaw:
            spd = throttle + pitch - roll + yaw;
            self.controller.setSpeed(spd, CW2_MOTOR);

            # CW2  = Throttle - Pitch + Roll - Yaw:
            spd = throttle - pitch + roll - yaw;
            self.controller.setSpeed(spd, CCW1_MOTOR);

            # CCW2 = Throttle - Pitch - Roll + Yaw:
            spd = throttle - pitch - roll + yaw;
            self.controller.setSpeed(spd, CCW2_MOTOR);

        # + CONFIG:
        elif(QUAD_CONFIG == PLUS_CONFIG):
            
            # CW1  = Throttle + Pitch - Yaw:
            spd = throttle + pitch - yaw;
            self.controller.setSpeed(spd, CW1_MOTOR);

            # CCW1 = Throttle + Roll + Yaw:
            spd = throttle + roll + yaw;
            self.controller.setSpeed(spd, CW2_MOTOR);

            # CW2  = Throttle - Pitch - Yaw:
            spd = throttle - pitch - yaw;
            self.controller.setSpeed(spd, CCW1_MOTOR);

            # CCW2 = Throttle - Roll + Yaw:
            spd = throttle - roll + yaw;
            self.controller.setSpeed(spd, CCW2_MOTOR);

    def updateSetpoint(self, message):
        """ Map the received message to valid setpoint values. """
        # self.setpoint[PITCH] = float(message['controllerRight']['y']) * MAX_PITCH_ANGLE;
        # self.setpoint[ROLL]  = float(message['controllerRight']['x']) * MAX_ROLL_ANGLE;
        # self.setpoint[YAW]   = float(message['controllerLeft']['x']) * MAX_YAW_ANGLE;
        
        # Read throttle value from the controller:
        value = float(message['controllerLeft']['y']);
        if(value == 0):
            self.setpoint[THROTTLE] = MIN_SPEED;
        else:
            self.setpoint[THROTTLE] = abs(value * MAX_SPEED);
        
if __name__ == "__main__":
    fc = FlightController().start();
    