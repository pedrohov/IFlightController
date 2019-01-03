#from flight_controller import *;
import json;

if __name__ == "__main__":
    """ Script to start the Flight Controller. """

    # Define the quadcopter configuration:
    # If it's set to both, the last will override the first config.
    # X_CONFIG or PLUS_CONFIG. The default is X_CONFIG.
    QUAD_CONFIG = X_CONFIG;
    
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