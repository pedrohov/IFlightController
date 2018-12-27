from mpu6050 import mpu6050;
import math;
import time;

def dist(a, b):
    return math.sqrt((a*a) + (b*b));

def getYrotation(x, y, z):
    radians = math.atan2(x, dist(y, z));
    return math.degrees(radians);
    
def getXrotation(x, y, z):
    radians = math.atan2(y, dist(x, z));
    return math.degrees(radians);

if __name__ == "__main__":
    
    now = time.time();
    
    mpu = mpu6050(0x68);
    
    angle = {};
    angle['x'] = 0;
    angle['y'] = 0;

    while True:
        print("MPU 6050");
        
        previousTime = now;
        now = time.time();
        
        accelData = mpu.get_accel_data();
        accelData['x'] = accelData['x'] / 16384.0;
        accelData['y'] = accelData['y'] / 16384.0;
        accelData['z'] = accelData['z'] / 16384.0;
        gyroData  = mpu.get_gyro_data();
        gyroData['x'] = gyroData['x'] / 131.0;
        gyroData['y'] = gyroData['y'] / 131.0;
        gyroData['z'] = gyroData['z'] / 131.0;
        
        accAngle = {};
        accAngle['x'] = getXrotation(accelData['x'], accelData['y'], accelData['z']);
        accAngle['y'] = getYrotation(accelData['x'], accelData['y'], accelData['z']);
        
        print("AcX: " + str(accAngle['x']));
        print("AcY: " + str(accAngle['y']));
        print("GyX: " + str(gyroData['x']));
        print("GyY: " + str(gyroData['y']));
        
        elapsedTime = now - previousTime;
        
        angle['x'] = 0.98 * (angle['x'] + gyroData['x'] * elapsedTime) + 0.02 * accAngle['x'];
        angle['y'] = 0.98 * (angle['y'] + gyroData['y'] * elapsedTime) + 0.02 * accAngle['y'];

        print("x: " + str(angle['x']));
        print("y: " + str(angle['y']));
