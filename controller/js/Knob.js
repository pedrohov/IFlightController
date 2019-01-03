function Knob(flightController, controller) {
	this.x = controller.x;
	this.y = controller.y;
	this.radius = 30;
    this.isSelected = false;
    this.controller = controller;
    this.context = controller.context;
    this.flightController = flightController;
    this.mouseOffsetX;
    this.mouseOffsetY;
}

Knob.prototype.update = function(x, y) {
    if(x > this.controller.x + this.controller.radius)
        this.x = this.controller.x + this.controller.radius;
    else if(x < this.controller.x - this.controller.radius)
        this.x = this.controller.x - this.controller.radius;
    else
        this.x = x;

    if(y > this.controller.y + this.controller.radius)
        this.y = this.controller.y + this.controller.radius;
    else if(y < this.controller.y - this.controller.radius)
        this.y = this.controller.y - this.controller.radius;
    else
        this.y = y;

    this.controller.knobOffsetX = this.centerDistanceX();
    this.controller.knobOffsetY = this.centerDistanceY();
    this.flightController.draw();
}

Knob.prototype.draw = function() {
	this.context.beginPath();
    if(this.isSelected)
        this.context.fillStyle = "#FEF6EB";
    else
        this.context.fillStyle = "#96C0CE";
	this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
	this.context.fill();
}

Knob.prototype.contains = function(x, y, radius) {
    if(((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y)) <= (this.radius * this.radius))
        return true;

    return false;
}

Knob.prototype.centerDistanceX = function() {
    let dist = ((this.x - this.controller.x) / this.controller.radius).toFixed(2);
	if(dist > 1)
		return 1;
	else if(dist < -1)
		return -1;

	return dist;
}

Knob.prototype.centerDistanceY = function() {
    let dist = ((this.controller.y - this.y) / this.controller.radius).toFixed(2);
	if(dist > 1)
		return 1;
	else if(dist < -1)
		return -1;
	return dist;
}

Knob.prototype.angle = function(x, y) {
	let addAngle = 0;
	if((x > 0) && (y < 0))
		addAngle = 360;
	else if(x < 0)
		addAngle = 180;

	let rad = Math.atan(y/x);
	if(isNaN(rad))
		return 0;

	let deg = (addAngle + 180 * rad / Math.PI).toFixed(2);
	return deg;
}

Knob.prototype.updatePosition = function(x, y) {
    this.x = x;
    this.y = y;
}