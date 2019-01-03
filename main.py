from flight_controller import *;
import json;

if __name__ == "__main__":
    """ Script to start the Flight Controller. """

    # QUADCOPTER CONFIGURATION:
    # If it's set to both, the last will override the first config.
    # X_CONFIG or PLUS_CONFIG. The default is X_CONFIG.
    QUAD_CONFIG = X_CONFIG;

    # ADITIONAL CONFIGURATION:
    # The value shown is the default value.

    # MAXIMUM TILT FOR EACH AXIS:
    # MAX_PITCH_ANGLE = 20;
    # MAX_ROLL_ANGLE  = 20;
    # MAX_YAW_ANGLE   = 180;

    # MOTOR GPIO PINS (using BCM numbering):
    # CW1_MOTOR  = 6;
    # CW2_MOTOR  = 13;
    # CCW1_MOTOR = 19;
    # CCW2_MOTOR = 26;

    # Minimum and max speed (depends on the ESCs specs):
    # MIN_SPEED = 1000;
    # MAX_SPEED = 2000;
    
    # Load PID constants:
    try:
        config_file = open('config.json', 'r');
        config = json.loads(config_file.read());
    except:
        print('Invalid configuration file.');
        exit();

    # Run the application:
    flight_controller = FlightController(config);
    flight_controller.start();