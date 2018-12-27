import RPi.GPIO as GPIO;
import pigpio;
import time;

# Set up BCM GPIO numbering:
GPIO.setmode(GPIO.BCM);

# Calibrate ESC:
escPin = 13;

# Connect to pigpio:
pi = pigpio.pi();

# Set up motor:
pi.set_servo_pulsewidth(escPin, 2000);
time.sleep(2);
pi.set_servo_pulsewidth(escPin, 1000);
time.sleep(2);

# Set speed to 1100ms for 5s:
pi.set_servo_pulsewidth(escPin, 1100);
time.sleep(5);

# Set speed to 0:
pi.set_servo_pulsewidth(escPin, 0);
pi.stop();
GPIO.cleanup();