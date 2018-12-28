/**
* @author: Pedro HOV
* @license:
*/

// Main code, executed once the app finishes loading:
$(document).ready(function() {

    // Draw border:
    /*context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.stroke();*/

    // Get canvas and its 2d context:
    let canvas  = document.getElementById("controllers");

    let connection = new WebSocket("ws:192.168.0.101:8080");;

    // Resize the canvas width to fit entire screen:
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create a new flightController:
    let flightController = new FlightController(110, canvas.width, canvas.height, canvas);

    // Read user input:
    window.addEventListener('touchstart', function(e) {
        for(var i = 0; i < e.touches.length; i++) {
            var x = e.touches[i].pageX - canvas.getBoundingClientRect().left;
            var y = e.touches[i].pageY - canvas.getBoundingClientRect().top;
            flightController.updateControllers(x, y);
        }
    });

    window.addEventListener('touchmove', function(e) {
        for(var i = 0; i < e.touches.length; i++) {
            var x = e.touches[i].pageX - canvas.getBoundingClientRect().left;
            var y = e.touches[i].pageY - canvas.getBoundingClientRect().top;
            flightController.moveControllers(x, y);
        }
    });

    window.addEventListener('touchend', function(e) {
        flightController.resetControllers();
    });

    window.onmousedown = function(e) {
        e = e || window.event;
        var x = (e.pageX || e.clientX) - canvas.getBoundingClientRect().left;
        var y = (e.pageY || e.clientY) - canvas.getBoundingClientRect().top;

        // Check if the mouse is clicking over a knob:
        flightController.updateControllers(x, y);
    }

    window.onmousemove = function(e) {
        e = e || window.event;
        var x = (e.pageX || e.clientX) - canvas.getBoundingClientRect().left;
        var y = (e.pageY || e.clientY) - canvas.getBoundingClientRect().top;

        // Check if the mouse dragged a knob and update the knob position:
        flightController.moveControllers(x, y);

        let message = flightController.getOffset();
        //console.log(message);
        connection.send(JSON.stringify(message));
    }

    window.onmouseup = function(e) {
        flightController.resetControllers();
    }

    // When the connection is open, send some data to the server
    connection.onopen = function () {
        // Update the controller's status:
        $("#con-status").removeClass("disconnected");
        $("#con-status-txt").html("Connected");
        $(this).html("DISCONNECT");

        console.log("Abriu");
        connection.send('Ping'); // Send the message 'Ping' to the server
    };

    // Log errors
    connection.onerror = function (error) {
        console.log('WebSocket Error ' + error);
    };

    // Log messages from the server
    connection.onmessage = function (e) {
        console.log('Server: ' + e.data);
    };
	
	// Buttons:
	$('#connect').click(function() {
		let isOffline = $("#con-status").hasClass("disconnected");
		
		// Display available connections:
		if(isOffline) {
			// Try to connect:
            //connection
		} else {
			$("#con-status").addClass("disconnected");
			$("#con-status-txt").html("Disconnected");
			$(this).html("CONNECT");
            connection.close();
		}
	});
});