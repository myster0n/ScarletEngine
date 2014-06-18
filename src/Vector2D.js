"use strict";

/**
 * Converted from actionscript found on http://rocketmandevelopment.com/
 */
if(!Math.TAU){
    Math.TAU=2*Math.PI;
}
if(!Math.squared){
    Math.squared=function(num){return num*num;}
}
if(!Math.isOverlapping){
    Math.isOverlapping=function(xmin,xmax,ymin,ymax){
        return Math.max(xmin,ymin) <= Math.min(xmax,ymax);
    };
}
if(!Math.toRadians){
    Math.toRadians=function(value){
        return value * Math.PI / 180;
    };
}
if(!Math.rnd){
    /**
     *
     * @param {Number} min
     * @param {Number} [max]
     * @returns {Number}
     */
    Math.rnd=function(min,max){
        if(max){
            max++;
            return Math.floor(Math.random()*(max-min))+min;
        }
        min++;
        return Math.floor(Math.random()*min);
    };
}
var Vector2D= (function(){

    /**
     * Constructor
     */
    function Vector2D(x,y){
        this._x=x||0;
        this._y=y||0;
    }
    /**
     * Set and get y component.
     */
    Vector2D.prototype.setY=function(value){
        this._y = value;
    };
    Vector2D.prototype.getY=function(){
        return this._y;
    };

    /**
     * Set and get x component.
     */
    Vector2D.prototype.setX=function(value){
        this._x = value;
    };
    Vector2D.prototype.getX=function(){
        return this._x;
    };

    /**
     * returns both x and y as an array
     * @return Array
     */
    Vector2D.prototype.getCoordArray=function(){
        return [this._x,this._y];
    };
    /**
     * returns both x and y as an object
     * @return Object
     */
    Vector2D.prototype.getCoordObj=function(){
        return {x:this._x,y:this._y};
    };
    /**
     * Creates an exact copy of this Vector2D
     * @return {Vector2D} A copy of this Vector2D
     */
    Vector2D.prototype.cloneVector=function(){
        return new Vector2D(this._x, this._y);
    };
    /**
     * Makes x and y zero.
     * @return {Vector2D} This vector.
     */
    Vector2D.prototype.zeroVector=function(){
        this._x=0;
        this._y=0;
        return this;
    };
    /**
     * Is this vector zeroed?
     * @return {Boolean} Returns true if zeroed, else returns false.
     */
    Vector2D.prototype.isZero=function(){
        return this._x===0&&this._y===0;
    };
    /**
     * Is the vector's length = 1?
     * @return {Boolean} If length is 1, true, else false.
     */
    Vector2D.prototype.isNormalized=function(){
        return this.getLength()==1.0;
    };
    /**
     * Does this vector have the same location as another?
     * @param vector2 The vector to test.
     * @return Boolean True if equal, false if not.
     */
    Vector2D.prototype.equals=function(vector2){
        return this._x == vector2.getX() && this._y == vector2.getY();
    };
    /**
     * Returns the length of this vector, before square root. Allows for a faster check.
     */
    Vector2D.prototype.getLengthSquared=function(){
        return Math.squared(this._x)+Math.squared(this._y);
    };
    /**
     * Returns the length of the vector.
     **/
    Vector2D.prototype.getLength=function(){
        return Math.sqrt(this.getLengthSquared());
    };
    /**
     * Sets the length which will change x and y, but not the angle.
     */
    Vector2D.prototype.setLength=function(value){
        var angle=this.getAngle();
        this._x=Math.cos(angle)*value;
        this._y=Math.sin(angle)*value;
        if(Math.abs(this._x)<0.00000001) this._x=0;
        if(Math.abs(this._y)<0.00000001) this._y=0;
    };
    /**
     *
     * @returns {Number} angle in radians
     */
    Vector2D.prototype.getAngle=function(){
        return Math.atan2(this._y,this._x);
    };
    /**
     *
     * @returns {Number} angle in degrees
     */
    Vector2D.prototype.getAngleDegrees=function(){
        var x=this.getAngle();
        x=(x > 0 ? x : (2*Math.PI + x)) * 360 / (2*Math.PI);
        return x;
    };
    /**
     * Changes the angle of the vector in radians. X and Y will change, length stays the same.
     * @param value
     * @returns {Vector2D}
     */
    Vector2D.prototype.setAngle=function(value){
        var len=this.getLength();
        this._x=Math.cos(value)*len;
        this._y=Math.sin(value)*len;
        return this;
    };
    /**
     * Changes the angle of the vector in degrees. X and Y will change, length stays the same.
     * @param value
     * @returns {Vector2D}
     */
    Vector2D.prototype.setAngleDegrees=function(value){
        return this.setAngle(value*Math.PI/180);
    };
    /**
     * Add an angle (radians value) to the current angle
     * @param value
     * @returns {Vector2D}
     */
    Vector2D.prototype.addAngle=function(value){
        var angle=this.getAngle();
        angle+=value;
        this.setAngle(angle);
        return this;
    };
    /**
     * Add an angle (degrees value) to the current angle
     * @param value
     * @returns {Vector2D}
     */
    Vector2D.prototype.addAngleDegrees=function(value){
        return this.addAngle(value*Math.PI/180);
    };
    /**
     * Sets the vector's length to 1.
     * @return Vector2D This vector.
     */
    Vector2D.prototype.normalize=function(){
        var len=this.getLength();
        if(len===0){
            this._x=1;
            return this;
        }
        this._x/=len;
        this._y/=len;
        return this;
    };
    /**
     * Sets the vector's length to len.
     * @param len The length to set it to.
     * @return Vector2D This vector.
     */
    Vector2D.prototype.normalcate = function(len){
        this.setLength(len);
        return this;
    };
    /**
     * Sets the length under the given value. Nothing is done if the vector is already shorter.
     * @param max The max length this vector can be.
     * @return Vector2D This vector.
     */
    Vector2D.prototype.truncate = function(max){
        this.setLength(Math.min(max,this.getLength()));
        return this;
    };
    /**
     * Makes the vector face the opposite way.
     * @return Vector2D This vector.
     */
    Vector2D.prototype.reverse = function(){
        this._x=-this._x;
        this._y=-this._y;
        return this;
    };
    /**
     * Calculate the dot product of this vector and another.
     * @param vector2 Another vector2D.
     * @return Number The dot product.
     */
    Vector2D.prototype.dotProduct=function(vector2){
        return this._x*vector2._x + this._y*vector2._y;
    };
    /**
     * Calculate the cross product of this and another vector.
     * @param vector2 Another Vector2D.
     * @return Number The cross product.
     */
    Vector2D.prototype.crossProduct=function(vector2){
        return this._x*vector2._y - this._y*vector2._x;
    };
    /**
     * Calculate angle between any two vectors.
     * @param vector1 First vector2d.
     * @param vector2 Second vector2d.
     * @return Number Angle between vectors.
     */
    Vector2D.angleBetween = function(vector1,vector2){
        if(!vector1.isNormalized()) vector1=vector1.cloneVector().normalize();
        if(!vector2.isNormalized()) vector2=vector2.cloneVector().normalize();
        return Math.acos(vector1.dotProduct(vector2));
    };
    /**
     * Get the vector that is perpendicular.
     * @return Vector2D The perpendicular vector.
     */
    Vector2D.prototype.getPerpendicular = function(){
        //noinspection JSSuspiciousNameCombination
        return new Vector2D(-this._y,this._x);
    };
    /**
     * Is the vector to the right or left of this one?
     * @param vector2 The vector to test.
     * @return Boolean If left, returns true, if right, false.
     */
    Vector2D.prototype.sign=function(vector2){
        return this.getPerpendicular().dotProduct(vector2)<0;
    };
    /**
     * Calculate distance between two vectors.
     * @param vector2 {Vector2D} The vector to find distance.
     * @return {Number} The distance.
     */
    Vector2D.prototype.distance=function(vector2){
        return Math.sqrt(this.distSQ(vector2));
    };
    /**
     * Calculate squared distance between vectors. Faster than distance.
     * @param vector2 {Vector2D} The other vector.
     * @return {Number} The squared distance between the vectors.
     */
    Vector2D.prototype.distSQ=function(vector2){
        var dx=vector2.getX()-this._x;
        var dy=vector2.getY()-this._y;
        return Math.squared(dx)+Math.squared(dy);
    };
    /**
     * Add a vector to this vector.
     * @param vector2 {Vector2D} The vector to add to this one.
     * @return {Vector2D} This vector.
     */
    Vector2D.prototype.add=function(vector2){
        this._x+=vector2.getX();
        this._y+=vector2.getY();
        return this;
    };
    /**
     * Subtract a vector from this one.
     * @param vector2 {Vector2D} The vector to subtract.
     * @return {Vector2D} This vector.
     */
    Vector2D.prototype.subtract=function(vector2){
        this._x-=vector2.getX();
        this._y-=vector2.getY();
        return this;
    };
    /**
     * Multiplies this vector by a scalar.
     * @param scalar The scalar to multiply by.
     * @return {Vector2D} This vector, multiplied.
     */
    Vector2D.prototype.multiply=function(scalar){
        this._x*=scalar;
        this._y*=scalar;
        return this;
    };
    /**
     * Divides this vector by a scalar.
     * @param scalar The scalar to multiply by.
     * @return {Vector2D} This vector, multiplied.
     */
    Vector2D.prototype.divide=function(scalar){
        this._x/=scalar;
        this._y/=scalar;
        return this;
    };

    return Vector2D;
})();