/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.start();
    },

    start: function() {
        // Get canvas and its 2d context:
        let canvas  = document.getElementById("controllers");

        //let connection = new WebSocket("ws:192.168.0.101:8080");
        let connection = new WebSocket("ws:192.168.0.101:8080");

        // Resize the canvas width to fit entire screen:
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;

        // Create a new flightController object:
        let flightController = new FlightController(110, canvas.width, canvas.height, canvas);

        // Detect mobile touch:
        window.addEventListener('touchstart', function(e) {
            for(var i = 0; i < e.touches.length; i++) {
                var x = e.touches[i].pageX - canvas.getBoundingClientRect().left;
                var y = e.touches[i].pageY - canvas.getBoundingClientRect().top;
                flightController.updateControllers(x, y);
            }
        });

        // Detect mobile touch movement:
        window.addEventListener('touchmove', function(e) {
            for(var i = 0; i < e.touches.length; i++) {
                var x = e.touches[i].pageX - canvas.getBoundingClientRect().left;
                var y = e.touches[i].pageY - canvas.getBoundingClientRect().top;
                flightController.moveControllers(x, y);
            }
        });

        // Detect mobile touch release:
        window.addEventListener('touchend', function(e) {
            flightController.resetControllers();
        });

        // Detect mouse click:
        window.onmousedown = function(e) {
            e = e || window.event;
            var x = (e.pageX || e.clientX) - canvas.getBoundingClientRect().left;
            var y = (e.pageY || e.clientY) - canvas.getBoundingClientRect().top;

            // Check if the mouse is clicking over a knob:
            flightController.updateControllers(x, y);
        }

        // Detect mouse movement:
        window.onmousemove = function(e) {
            e = e || window.event;
            var x = (e.pageX || e.clientX) - canvas.getBoundingClientRect().left;
            var y = (e.pageY || e.clientY) - canvas.getBoundingClientRect().top;

            // Check if the mouse dragged a knob and update the knob position:
            let changed = flightController.moveControllers(x, y);

            // Only send new status message if the controller changed state:
            if(changed) {
                let message = flightController.getOffset();
                connection.send(JSON.stringify(message));
            }
        }

        // Reset the controller state:
        window.onmouseup = function(e) {
            flightController.resetControllers();
        }

        // When the connection is open, update the connection status:
        connection.onopen = function () {
            // Update the controller's status:
            $("#con-status").removeClass("disconnected");
            $("#con-status-txt").html("Connected");
        };

        // Log errors:
        connection.onerror = function (error) {
            console.log('WebSocket Error: ' + error);
            $("#con-status").addClass("disconnected");
            $("#con-status-txt").html("Disconnected");
        };

        // Update
        connection.onclose = function (event) {
            console.log('WebSocket is closed');
            $("#con-status").addClass("disconnected");
            $("#con-status-txt").html("Disconnected");
        };

        // Log messages from the server
        connection.onmessage = function (e) {
            console.log('Server: ' + e.data);
        };
    }
};

app.initialize();