from PID_controller import *;

if __name__ == "__main__":
    
    """ Script to start the Flight Controller. """
    flight_controller = FlightController();
    flight_controller.start();