function FlightController(x, y, h, canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    this.controller1 = new Controller(this, this.context, 20 + x, h / 2);
    this.controller2 = new Controller(this, this.context, y - x - 20, h / 2); /* x + 285 , y + 135*/
    this.controller1.draw();
    this.controller2.draw();

    // Keeps track of the last move update:
    //this.lastInteraction = 0;
}

FlightController.prototype.resetControllers = function() {
    this.controller1.reset();
    this.controller2.reset();
}

FlightController.prototype.updateControllers = function(mouseX, mouseY) {
    this.controller1.update(mouseX, mouseY);
    this.controller2.update(mouseX, mouseY);
}

FlightController.prototype.moveControllers = function(mouseX, mouseY) {
    // Check if the user is holding a knob:
    if(this.controller1.knob.contains(mouseX, mouseY) && this.controller1.isSelected) {
        // Check if the next move is inside the controller:
        if(this.controller1.contains(mouseX, mouseY))
            this.controller1.knob.update(mouseX - this.controller1.knob.mouseOffsetX, mouseY - this.controller1.knob.mouseOffsetY);
    }

    if(this.controller2.knob.contains(mouseX, mouseY) && this.controller2.isSelected) {
        if(this.controller2.contains(mouseX, mouseY))
            this.controller2.knob.update(mouseX - this.controller2.knob.mouseOffsetX, mouseY - this.controller2.knob.mouseOffsetY);
    }
}

FlightController.prototype.draw = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.controller1.draw();
    this.controller2.draw();
}

FlightController.prototype.getOffset = function() {
    return {
        "controllerLeft" : this.controller1.getOffset(),
        "controllerRight": this.controller2.getOffset()
    };
}