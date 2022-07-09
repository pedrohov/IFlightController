//var piAddress = "192.168.0.101"; // Raspberry pi's IP address
var piAddress = "";
var piPort = "";
var socket = null;

// Main code, executed once the app finishes loading:
$(document).ready(function () {
  // Get canvas and its 2d context:
  let canvas = document.getElementById("controllers");

  // Resize the canvas width to fit entire screen:
  setCanvasSize(canvas);

  // Create a new flightController object:
  let flightController = new FlightController(
    110,
    canvas.width,
    canvas.height,
    canvas
  );

  // Detect mobile touch:
  window.addEventListener("touchstart", function (e) {
    for (var i = 0; i < e.touches.length; i++) {
      var x = e.touches[i].pageX - canvas.getBoundingClientRect().left;
      var y = e.touches[i].pageY - canvas.getBoundingClientRect().top;
      flightController.updateControllers(x, y);
    }
  });

  // Detect mobile touch movement:
  window.addEventListener("touchmove", function (e) {
    for (var i = 0; i < e.touches.length; i++) {
      var x = e.touches[i].pageX - canvas.getBoundingClientRect().left;
      var y = e.touches[i].pageY - canvas.getBoundingClientRect().top;
      flightController.moveControllers(x, y);
    }
  });

  // Detect mobile touch release:
  window.addEventListener("touchend", function (e) {
    flightController.resetControllers();
  });

  // Handle window resize:
  window.addEventListener("resize", function (e) {
    setCanvasSize(canvas);
    flightController.updatePosition(110, canvas.width, canvas.height);
  });

  // Detect mouse click:
  window.addEventListener("mousedown", function (e) {
    e = e || window.event;
    var x = (e.pageX || e.clientX) - canvas.getBoundingClientRect().left;
    var y = (e.pageY || e.clientY) - canvas.getBoundingClientRect().top;

    // Check if the mouse is clicking over a knob:
    flightController.updateControllers(x, y);
  });

  // Detect mouse movement:
  window.addEventListener("mousemove", function (e) {
    e = e || window.event;
    var x = (e.pageX || e.clientX) - canvas.getBoundingClientRect().left;
    var y = (e.pageY || e.clientY) - canvas.getBoundingClientRect().top;

    // Check if the mouse dragged a knob, update the knob position:
    let changed = flightController.moveControllers(x, y);

    // Only send new status message if the controller changed state:
    if (changed && socket !== null) {
      let message = flightController.getOffset();
      socket.send(JSON.stringify(message));
    }
  });

  // Reset the controller state:
  window.addEventListener("mouseup", function (e) {
    flightController.resetControllers();
  });
});

function toggleConnect() {
  let isOffline = $("#con-status").hasClass("disconnected");

  // Try to connect:
  if (isOffline) openWebsocket();
  // Close connection:
  else socket.close();
}

function openWebsocket() {
  try {
    piAddress = document.getElementById("ip").value;
    piPort = document.getElementById("port").value;

    socket = new WebSocket("ws:" + piAddress + ":" + piPort);

    // When the connection is open, update the connection status:
    socket.onopen = function () {
      // Update the controller's status:
      $("#con-status").removeClass("disconnected");
      $("#con-status-txt").html("Connected");
      $("#connect").html("DISCONNECT");

      // Disable address input:
      $("#ip").prop("disabled", true);
      $("#port").prop("disabled", true);
    };

    // Log errors:
    socket.onerror = function (error) {
      $("#con-status").addClass("disconnected");
      $("#con-status-txt").html("Disconnected");
    };

    // Update
    socket.onclose = function (event) {
      console.log("WebSocket is closed");

      // Code 1006: Abnormal Closure (https://www.iana.org/assignments/websocket/websocket.xml):
      if (event.code === 1006)
        alert(
          "CONNECTION REFUSED:\nCheck if the IP:Port is correct and listening to connections."
        );

      $("#con-status").addClass("disconnected");
      $("#con-status-txt").html("Disconnected");
      $("#connect").html("CONNECT");
      socket = null;

      // Enable address input:
      $("#ip").prop("disabled", false);
      $("#port").prop("disabled", false);
    };

    // Log messages from the server
    socket.onmessage = function (e) {
      console.log("Server: " + e.data);
    };
  } catch (exception) {
    console.log(exception);
  }
}

function setCanvasSize(canvas) {
  canvas.width = window.innerWidth > 800 ? 800 : window.innerWidth;
  canvas.height = window.innerHeight > 600 ? 600 : window.innerHeight;
  $("#controllers").css("margin-left", "-" + canvas.width / 2 + "px");
  $("#controllers").css("margin-top", "-" + canvas.height / 2 + "px");
}
