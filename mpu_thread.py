from mpu6050 import mpu6050;
from threading import Thread;
import math;
import time;

class MPU(Thread):
    def __init__(self, reg):
        super(MPU, self).__init__();

        self.mpu   = mpu6050(reg);
        self.accel = self.getAccelData();
        self.gyro  = self.getGyroData();

        # Real angle:
        self.angle = {'x': 0, 'y': 0};

        # Calculate the angle given accelerometer data.
        # The parsed gyro data is already given in degrees:
        self.accAngle = self.calcAccAngle();

    def run(self):
        now = time.time();

        while(True):
            print("MPU 6050");
            previousTime = now;
            now = time.time();

            self.accAngle = self.calcAccAngle();

            print("AcX: " + str(self.accAngle['x']));
            print("AcY: " + str(self.accAngle['y']));
            print("GyX: " + str(self.gyro['x']));
            print("GyY: " + str(self.gyro['y']));
            
            elapsedTime = now - previousTime;

            self.angle['x'] = 0.98 * (self.angle['x'] + self.gyro['x'] * elapsedTime) + 0.02 * self.accAngle['x'];
            self.angle['y'] = 0.98 * (self.angle['y'] + self.gyro['y'] * elapsedTime) + 0.02 * self.accAngle['y'];

            print("x: " + str(self.angle['x']));
            print("y: " + str(self.angle['y']));


    def getAccelData(self):
        self.accel = self.mpu.get_accel_data();
        self.parseAccelData();

    def getGyroData(self):
        self.gyro  = self.mpu.get_gyro_data();
        self.parseGyroData();

    def parseAccelData(self):
        self.accel['x'] = self.accel['x'] / 16384.0;
        self.accel['y'] = self.accel['y'] / 16384.0;
        self.accel['z'] = self.accel['z'] / 16384.0;

    def parseGyroData(self):
        self.gyro['x'] = self.gyro['x'] / 131.0;
        self.gyro['y'] = self.gyro['y'] / 131.0;
        self.gyro['z'] = self.gyro['z'] / 131.0;

    def calcAccAngle(self):
        accAngle = {};
        accAngle['x'] = self.getXrotation(self.accel['x'], self.accel['y'], self.accel['z']);
        accAngle['y'] = self.getYrotation(self.accel['x'], self.accel['y'], self.accel['z']);
        return accAngle;

    def dist(self, a, b):
        return math.sqrt((a*a) + (b*b));

    def getYrotation(self, x, y, z):
        radians = math.atan2(x, dist(y, z));
        return math.degrees(radians);
        
    def getXrotation(self, x, y, z):
        radians = math.atan2(y, dist(x, z));
        return math.degrees(radians);

if __name__ == "__main__":
    mpu = self.MPU(0x68);
    mpu.run();