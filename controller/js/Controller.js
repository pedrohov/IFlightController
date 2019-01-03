function Controller(flightController, context, x, y) {
	this.x = x;
	this.y = y;
	this.radius = 70;
    this.isSelected = false;
    this.flightController = flightController;
    this.context = context;
	this.knob = new Knob(flightController, this);
    this.knobOffsetX = this.knob.centerDistanceX();
    this.knobOffsetY = this.knob.centerDistanceY();   
}

Controller.prototype.update = function(mouseX, mouseY) {
    if(this.knob.contains(mouseX, mouseY)) {
        this.knob.x = mouseX;
        this.knob.y = mouseY;
        this.knob.isSelected = true;
        this.isSelected = true;
        this.knob.mouseOffsetX = mouseX - this.knob.x;
        this.knob.mouseOffsetY = mouseY - this.knob.y;
        this.draw();
    }
    /*else {
        this.knob.isSelected = false;
        this.isSelected = false;
    }*/
}

Controller.prototype.draw = function() {
    // Border:
    this.context.beginPath();
    this.context.lineWidth = "10";
    if(this.isSelected)
        this.context.strokeStyle = "#FEF6EB";
    else
        this.context.strokeStyle = "#96C0CE";
    this.context.arc(this.x, this.y, this.radius + 10, 0, 2 * Math.PI);
    this.context.stroke();

    // Able area:
    this.context.beginPath();
    this.context.fillStyle = "#74828F";
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.context.fill();

    // Knob:
    this.knob.draw();

    // Draw coordinates:
    this.context.font = "20px Lato";
    this.context.textAlign = "center";
    this.context.fillText(this.knobOffsetX + ', ' + this.knobOffsetY, this.x, this.y + this.radius + 40);
    this.context.fillText(this.knob.angle(this.knobOffsetX, this.knobOffsetY) + 'º', this.x, this.y + this.radius + 60);
}

Controller.prototype.getOffset = function() {
    return {
        "x": this.knobOffsetX,
        "y": this.knobOffsetY
    };
}

Controller.prototype.contains = function(x, y) {
    if(((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y)) <= (this.radius * this.radius))
        return true;
    return false;
}

Controller.prototype.reset = function() {
    this.knob.isSelected = false;
    this.isSelected = false;
    this.knob.update(this.x, this.y);
}

Controller.prototype.updatePosition = function(x, y) {
    this.x = x;
    this.y = y;
    this.knob.updatePosition(x, y);
}