var Player = function() 
{
	this.image = document.createElement("img");
	this.x = 350;
	this.y = 235; 
	this.width = 159;
	this.height = 163;
	
	this.velocity = 1;
	
	this.angularvelocity = 0;
	this.rotation = 0;

	this.falling = true;
	this.jumping = false;

	this.image.src = "hero.png";
};

var player = new Player();

var TILE = 35;
var METER = TILE;
var GRAVITY = METER * 9.8 * 6;
var MAXDX = METER * 10;
var MAXDY = METER * 15;
var ACCEL = MAXDX * 2;
var FRICTION = MAXDX * 6;
var JUMP = METER * 1500;

Player.prototype.update = function(deltaTime)
{
	// we’ll insert code here later

	 var left = false;
	 var right = false;
	 var jump = false;
	 
	 // check keypress events
	 if(keyboard.isKeyDown(keyboard.KEY_LEFT) == true) {
	 	left = true;
	 }
	 if(keyboard.isKeyDown(keyboard.KEY_RIGHT) == true) {
	 	right = true;
	 }
	 if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true) {
	 	jump = true;
	 }

	 var wasleft = this.velocity.x < 0;
	 var wasright = this.velocity.x > 0;
	 var falling = this.falling;
	 var ddx = 0; // acceleration
	 var ddy = GRAVITY;

	 if (left)
	 	ddx = ddx - ACCEL; // player wants to go left
	 else if (wasleft)
	 	ddx = ddx + FRICTION; // player was going left, but not any more
	 if (right)
	 	ddx = ddx + ACCEL; // player wants to go right
	 else if (wasright)
	 	ddx = ddx - FRICTION; // player was going right, but not any more
	 if (jump && !this.jumping && !falling)
	 {
	 	ddy = ddy - JUMP; // apply an instantaneous (large) vertical impulse
	 	this.jumping = true;
	 }
	 // calculate the new position and velocity:
	 this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
	 this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
	 this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX, MAXDX);
	 this.velocity.y = bound(this.velocity.y + (deltaTime * ddy), -MAXDY, MAXDY);

	 if ((wasleft && (this.velocity.x > 0)) ||
	 	(wasright && (this.velocity.x <0)))
	 {
	 	this.velocity.x = 0;
	 }



	// collision detection
	// Our collision detection logic is greatly simplified by the fact that the
	// player is a rectangle and is exactly the same size as a single tile.
	// So we know that the player can only ever occupy 1, 2 or 4 cells.

	// This means we can short-circuit and avoid building a general purpose
	// collision detection engine by simply looking at the 1 to 4 cells that
	// the player occupies:
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	var nx = (this.position.x)%TILE; // true if player overlaps right
	var ny = (this.position.y)%TILE; // true if player overlaps below
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
}

Player.prototype.draw = function()
{
	context.save();
		context.translate(this.x, this.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2);
	context.restore();
}