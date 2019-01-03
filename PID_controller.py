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
        # if(error > -3) and (error < 3):
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