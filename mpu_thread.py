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
            
            self.accel = self.getAccelData();
            self.gyro  = self.getGyroData();
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
        accel = self.mpu.get_accel_data();
        accel = self.parseAccelData(accel);
        return accel;

    def getGyroData(self):
        gyro = self.mpu.get_gyro_data();
        gyro = self.parseGyroData(gyro);
        return gyro;

    def parseAccelData(self, data):
        data['x'] = data['x'] / 16384.0;
        data['y'] = data['y'] / 16384.0;
        data['z'] = data['z'] / 16384.0;
        return data;

    def parseGyroData(self, data):
        data['x'] = data['x'] / 131.0;
        data['y'] = data['y'] / 131.0;
        data['z'] = data['z'] / 131.0;
        return data;

    def calcAccAngle(self):
        accAngle = {};
        accAngle['x'] = self.getXrotation(self.accel['x'], self.accel['y'], self.accel['z']);
        accAngle['y'] = self.getYrotation(self.accel['x'], self.accel['y'], self.accel['z']);
        return accAngle;

    def dist(self, a, b):
        return math.sqrt((a*a) + (b*b));

    def getYrotation(self, x, y, z):
        radians = math.atan2(x, self.dist(y, z));
        return math.degrees(radians);
        
    def getXrotation(self, x, y, z):
        radians = math.atan2(y, self.dist(x, z));
        return math.degrees(radians);

if __name__ == "__main__":
    mpu = MPU(0x68);
    mpu.run();