import os;
import sys;
import time;
import RPi.GPIO as GPIO;
import pigpio;
from threading import Thread;

class App(Thread):
    
    def __init__(self):
        
        super(App, self).__init__();
        
        # Motor speed:
        self.vel = 1000;
        
        # Set up BCM GPIO numbering:
        GPIO.setmode(GPIO.BCM);

        # Define motor pins:
        self.motorH1 = 6;
        self.motorH2 = 13;
        self.motorAH1 = 19;
        self.motorAH2 = 26;

        # Connect to pigpio:
        os.system("sudo pigpiod"); # Start pigpio daemon.
        self.pi = pigpio.pi();
        
        # Calibrate ESCs:
        #self.calibrate();
    
    def calibrate(self):
        self.pi.set_servo_pulsewidth(self.motorH1, 2000);
        self.pi.set_servo_pulsewidth(self.motorH2, 2000);
        self.pi.set_servo_pulsewidth(self.motorAH1, 2000);
        self.pi.set_servo_pulsewidth(self.motorAH2, 2000);
        time.sleep(2);
        self.pi.set_servo_pulsewidth(self.motorH1, 1000);
        self.pi.set_servo_pulsewidth(self.motorH2, 1000);
        self.pi.set_servo_pulsewidth(self.motorAH1, 1000);
        self.pi.set_servo_pulsewidth(self.motorAH2, 1000);
        time.sleep(2);
    
    def setVelocidade(self, valor):
        self.vel = valor;
        self.pi.set_servo_pulsewidth(self.motorH1 , self.vel);
        self.pi.set_servo_pulsewidth(self.motorH2 , self.vel);
        self.pi.set_servo_pulsewidth(self.motorAH1, self.vel);
        self.pi.set_servo_pulsewidth(self.motorAH2, self.vel);
    
    def run(self):
        
        while(True):
            # Value between 500~2500:
            print("Current speed: " + str(self.vel));
            try:
                valor = int(input("Set speed: "));
                if(valor == "-1"):
                    break;
            except:
                break;
            
            self.setVelocidade(int(valor));
        
        # Cleanup:
        self.pi.set_servo_pulsewidth(self.motorH1 , 0);
        self.pi.set_servo_pulsewidth(self.motorH2 , 0);
        self.pi.set_servo_pulsewidth(self.motorAH1, 0);
        self.pi.set_servo_pulsewidth(self.motorAH2, 0);
        self.pi.stop();
        GPIO.cleanup();

if __name__ == "__main__":
    app = App();
    app.start();
    
