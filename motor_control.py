import os;
import sys;
import time;
import RPi.GPIO as GPIO;
import pigpio;

CW1_MOTOR  = 6;
CW2_MOTOR  = 13;
CCW1_MOTOR = 19;
CCW2_MOTOR = 26;

MIN_SPEED = 1000;
MAX_SPEED = 2000;

class MotorControl():
    """ Class that defines motor pin connection,
        sets the speed using Pigpio's PWM and
        handle errors.
    """

    def __init__(self):

        # Set up BCM GPIO numbering:
        GPIO.setmode(GPIO.BCM);

        # Connect to pigpio:
        os.system("sudo pigpiod"); # Start pigpio daemon.
        self.pi = pigpio.pi();

        # Calibrate ESCs:
        self.calibrate();

    def setSpeed(self, speed, motor=0):
        """ Set the speed for the specified motor.
            If no motor was passed as parameter set the same speed for all motors.
            If the speed is below MIN_SPEED or above MAX_SPEED, do nothing.
        """
        if(speed < MIN_SPEED) or (speed > MAX_SPEED):
            return;

        if(motor == 0):
            self.pi.set_servo_pulsewidth(CW1_MOTOR , speed);
            self.pi.set_servo_pulsewidth(CW2_MOTOR , speed);
            self.pi.set_servo_pulsewidth(CCW1_MOTOR, speed);
            self.pi.set_servo_pulsewidth(CCW2_MOTOR, speed);
        else:
            self.pi.set_servo_pulsewidth(motor, speed);
        return;

    def calibrate(self):
        self.pi.set_servo_pulsewidth(CW1_MOTOR , MAX_SPEED);
        self.pi.set_servo_pulsewidth(CW2_MOTOR , MAX_SPEED);
        self.pi.set_servo_pulsewidth(CCW1_MOTOR, MAX_SPEED);
        self.pi.set_servo_pulsewidth(CCW2_MOTOR, MAX_SPEED);
        time.sleep(2);
        self.pi.set_servo_pulsewidth(CW1_MOTOR , MIN_SPEED);
        self.pi.set_servo_pulsewidth(CW2_MOTOR , MIN_SPEED);
        self.pi.set_servo_pulsewidth(CCW1_MOTOR, MIN_SPEED);
        self.pi.set_servo_pulsewidth(CCW2_MOTOR, MIN_SPEED);
        time.sleep(2);
        return;

    def cleanup(self):
        self.setSpeed(0);
        self.pi.stop();
        GPIO.cleanup();