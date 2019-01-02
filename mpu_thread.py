from mpu6050   import mpu6050;
from threading import Thread;
import math;
import time;

PITCH    = 'x';
ROLL     = 'y';
YAW      = 'z';
THROTTLE = 'T';

class MPU(Thread):
    def __init__(self, reg):
        
        Thread.__init__(self);

        self.mpu   = mpu6050(reg);
        self.accel = self.getAccelData();
        self.gyro  = self.getGyroData();

        # Real angle:
        self.angle = {PITCH: 0, ROLL: 0};

        # Calculate the angle given accelerometer data.
        # The parsed gyro data is already given in degrees:
        self.accAngle = self.calcAccAngle();

    def run(self):
        now = time.time();

        while(True):
            previousTime = now;
            now = time.time();
            
            self.accel = self.getAccelData();
            self.gyro  = self.getGyroData();
            self.accAngle = self.calcAccAngle();
           
            elapsedTime = now - previousTime;

            self.angle[PITCH] = 0.98 * (self.angle[PITCH] + self.gyro[PITCH] * elapsedTime) + 0.02 * self.accAngle[PITCH];
            self.angle[ROLL] = 0.98 * (self.angle[ROLL] + self.gyro[ROLL] * elapsedTime) + 0.02 * self.accAngle[ROLL];

            self.debug();

    def debug(self):
        print("MPU 6050");
        print("PITCH: " + str(self.angle[PITCH]));
        print("ROLL: " + str(self.angle[ROLL]));

    def getAccelData(self):
        accel = self.mpu.get_accel_data();
        accel = self.parseAccelData(accel);
        return accel;

    def getGyroData(self):
        gyro = self.mpu.get_gyro_data();
        gyro = self.parseGyroData(gyro);
        return gyro;

    def parseAccelData(self, data):
        data[PITCH] = data['x'] / 16384.0;
        data[ROLL] = data['y'] / 16384.0;
        data[YAW] = data['z'] / 16384.0;
        return data;

    def parseGyroData(self, data):
        data[PITCH] = data['x'] / 131.0;
        data[ROLL] = data['y'] / 131.0;
        data[YAW] = data['z'] / 131.0;
        return data;

    def calcAccAngle(self):
        accAngle = {};
        accAngle[PITCH] = self.getXrotation(self.accel[PITCH], self.accel[ROLL], self.accel[YAW]);
        accAngle[ROLL] = self.getYrotation(self.accel[PITCH], self.accel[ROLL], self.accel[YAW]);
        return accAngle;

    def dist(self, a, b):
        return math.sqrt((a * a) + (b * b));

    def getYrotation(self, x, y, z):
        radians = math.atan2(x, self.dist(y, z));
        return math.degrees(radians);
        
    def getXrotation(self, x, y, z):
        radians = math.atan2(y, self.dist(x, z));
        return math.degrees(radians);

if __name__ == "__main__":
    mpu = MPU(0x68);
    mpu.run();