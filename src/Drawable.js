var Drawable = (function () {
"use strict";
    /**
     *
     * @param {Number} centerX
     * @param {Number} centerY
     * @param {Number} [rotationOffset]
     * @constructor
     */
    function Drawable(centerX, centerY,rotationOffset) {
        this.childrenabove = [];
        this.childrenbelow = [];
        this.alpha = null;
        this.scaleX = 1;
        this.scaleY = 1;
        this.centerX = centerX;
        this.centerY = centerY;
        this.position = new Vector2D();
        this.rotation = new Vector2D();
        this.rotation.normalize();
        this.parent = null;
        this.rotationOffset = Math.toRadians(rotationOffset || 0);
        this.clamps = {active: false, min: 0, max: 0, mid: 0, absolute: false};
        this.collision={active:false};
    }

    /**
     *
     * @param {Number} x1
     * @param {Number} y1
     * @param {Number} x2
     * @param {Number} y2
     * @param {Boolean} [fromZero]
     * @returns {Drawable}
     */
    Drawable.prototype.setCollisionBox=function(x1,y1,x2,y2,fromZero){
        if(!!fromZero){
            x1-=this.centerX;
            x2-=this.centerX;
            y1-=this.centerY;
            y2-=this.centerY;
        }
        var center=new Vector2D((x1+x2)/2,(y1+y2)/2);
        var tmp=new Vector2D(x1,y1);
        var length=center.distance(tmp);
        this.collision={active:true,x1:Math.min(x1,x2),y1:Math.min(y1,y2),x2:Math.max(x1,x2),y2:Math.max(y1,y2),center:center,length:length};
        return this;
    };
    /**
     *
     * @param {boolean} active
     */
    Drawable.prototype.collisionMode=function(active){
        if(active){
            if(this.collision.x1){
                this.collision.active=true;
            }
        }else{
            this.collision.active=false;
        }
    };
    /**
     *
     * @returns {Vector2D[]}
     */
    Drawable.prototype.getAbsoluteCollisionBox=function(){
        var center=this.getAbsolutePosition();
        var angle=this.getAbsoluteAngle();
        var v1=new Vector2D(this.collision.x1*this.scaleX,this.collision.y1*this.scaleY);
        var v2=new Vector2D(this.collision.x1*this.scaleX,this.collision.y2*this.scaleY);
        var v3=new Vector2D(this.collision.x2*this.scaleX,this.collision.y2*this.scaleY);
        var v4=new Vector2D(this.collision.x2*this.scaleX,this.collision.y1*this.scaleY);
        v1.addAngle(angle).add(center);
        v2.addAngle(angle).add(center);
        v3.addAngle(angle).add(center);
        v4.addAngle(angle).add(center);
        return [v1,v2,v3,v4];
    };
    /**
     *
     * @returns {{center: Vector2D, length: Number}}
     */
    Drawable.prototype.getAbsoluteCollisionCircle=function(){
        var center=this.getAbsolutePosition();
        var angle=this.getAbsoluteAngle();
        return {center:this.collision.center.cloneVector().addAngle(angle).add(center),length:this.collision.length};
    };
    /**
     *
     * @param {Drawable} object
     * @returns {boolean}
     */
    Drawable.prototype.collidesWith=function(object){
        var cir1=this.getAbsoluteCollisionCircle();
        var cir2=object.getAbsoluteCollisionCircle();
        var dist=cir1.length+cir2.length;
        if(cir1.center.distance(cir2.center)>dist){
            return false;
        }
        return this.rectCollidesWithRect(object);
    };
    /**
     *
     * @param {Drawable} object
     * @returns {boolean}
     */
    Drawable.prototype.rectCollidesWithRect=function(object){
        var collide;
        var colBox=this.getAbsoluteCollisionBox();
        var extColBox=object.getAbsoluteCollisionBox();

        collide=checkOverlap(colBox[0],colBox[1],extColBox);
        if(!collide){
            return false;
        }
        collide=checkOverlap(colBox[1],colBox[2],extColBox);
        if(!collide){
            return false;
        }
        collide=checkOverlap(extColBox[0],extColBox[1],colBox);
        if(!collide){
            return false;
        }
        collide=checkOverlap(extColBox[1],extColBox[2],colBox);
        return collide;
    };
    var checkOverlap=function(axisStart,axisFinish,points){
        var axis=axisFinish.cloneVector().subtract(axisStart);
        var len=axis.dotProduct(axis);
        var zero=Math.min(0,len);
        len=Math.max(0,len);
        var ext=points[0].cloneVector().subtract(axisStart);
        var dp=axis.dotProduct(ext);
        if(dp>=zero && dp<=len) return true;
        var min=dp;
        var max=dp;
        for(var i=1;i<4;i++){
            ext=points[i].cloneVector().subtract(axisStart);
            dp=axis.dotProduct(ext);
            if(dp>=zero && dp<=len) return true;
            min=Math.min(min,dp);
            max=Math.max(max,dp);
        }
        return Math.isOverlapping(zero,len,min,max);
    };

    /**
     *
     * @param {Drawable|Sprite|Poly} object
     * @param {Number} [margin]
     * @returns {boolean}
     */
    Drawable.prototype.isPointingAt=function(object,margin){
        margin=margin||0;
        var ob=object.getAbsolutePosition();
        ob.subtract(this.getAbsolutePosition());
        var ang=(ob.getAngleDegrees()+720)%360;
        var testAngle=this.getAbsoluteAngleDegrees()+720;
        var min=(testAngle-margin)%360;
        var max=(testAngle+margin)%360;
        return ang>min && ang<max;
    };
    /**
     *
     * @param {CanvasRenderingContext2D} context
     * @returns {Drawable}
     */
    Drawable.prototype.setContext = function (context) {
        this.ctx = context;
        this.draw = this._draw;
        for(var i=0;i<this.childrenabove.length;i++){
            this.childrenabove[i].setContext(this.ctx);
        }
        for(i=0;i<this.childrenbelow.length;i++){
            this.childrenbelow[i].setContext(this.ctx);
        }
        return this;
    };
    /**
     *
     * @param {Number} value
     * @returns {Drawable}
     */
    Drawable.prototype.setRotationOffset = function (value) {
        this.rotationOffset = value;
        this.changed();
        return this;
    };
    /**
     *
     * @param {Number} value
     * @returns {Drawable}
     */
    Drawable.prototype.setRotationOffsetDegrees = function (value) {
        return this.setRotationOffset(value * Math.PI / 180);
    };
    /**
     * set clamps in radians
     * @param {Number} min
     * @param {Number} max
     * @param {Boolean} [absolute]
     * @returns {Drawable}
     */
    Drawable.prototype.setClamps = function (min, max, absolute) {
        min=min/Math.PI;
        max=max/Math.PI;

        return this.setClampsPI(min,max,absolute);
    };
    /**
     * As radians goes from 0 to 2*PI, this goes from 0 to 2
     * @param {Number} min
     * @param {Number} max
     * @param {Boolean} [absolute]
     * @returns {Drawable}
     */
    Drawable.prototype.setClampsPI = function(min, max, absolute){
        min=((min%2)+2)%2;
        if(min>1){
            min-=2;
        }
        if(min>max){
            min-=2;
        }
        var mid=(((min+max)/2)+1)%2;
        this.clamps = {active: true, min: min, max: max, mid: mid, absolute: !!absolute};
        return this;
    };
    /**
     * set clamps in degrees
     * @param {Number} min
     * @param {Number} max
     * @param {Boolean} [absolute]
     * @returns {Drawable}
     */
    Drawable.prototype.setClampsDegrees = function (min, max, absolute) {
        return this.setClampsPI(min/180, max/180, absolute);
    };
    /**
     *
     * @returns {Drawable}
     */
    Drawable.prototype.removeClamps = function () {
        this.clamps = {active: false, min: 0, max: 0, mid: 0, absolute: false};
        return this;
    };
    /**
     *
     * @param {Number} value
     * @returns {Drawable}
     */
    Drawable.prototype.setAlpha = function (value) {
        this.alpha = value;
        this.changed();
        return this;
    };
    /**
     *
     * @param {Number} x
     * @param {Number} [y]
     * @returns {Drawable}
     */
    Drawable.prototype.setScale = function (x, y) {
        this.scaleX = x;
        this.scaleY = y || x;
        this.changed();
        return this;
    };
    /**
     *
     * @param {Drawable} child
     * @param {Boolean} [above]
     * @returns {Drawable}
     */
    Drawable.prototype.addChild = function (child, above) {
        if (above) {
            this.childrenabove.push(child);
        } else {
            this.childrenbelow.push(child);
        }
        child.setContext(this.ctx);
        child.setParent(this);
        child.setPlayArea(this.playArea);
        return this;
    };
    /**
     *
     * @param {Drawable} child
     */
    Drawable.prototype.removeChild = function (child) {
        if (this.childrenabove.indexOf(child) > -1) {
            this.childrenabove.splice(this.childrenabove.indexOf(child), 1);
        } else if (this.childrenbelow.indexOf(child) > -1) {
            this.childrenbelow.splice(this.childrenbelow.indexOf(child), 1);
        }
    };
    /**
     * kills all the children and removes itself from the parent
     * @returns {null}
     */
    Drawable.prototype.kill = function () {
        if (typeof this.parent !== "undefined" && this.parent !== null) {
            this.parent.removeChild(this);
        }
        var children = this.childrenabove.concat(this.childrenbelow);
        this.childrenabove = [];
        this.childrenbelow = [];
        children.forEach(function (child) {
            child.parent = null;
            child.kill();
        });
        this.ctx = null;
        this.draw = function () {
        };
        this.changed();
        this.parent = null;
        return null;
    };
    /**
     *
     * @param {Drawable | PlayArea} parent
     * @returns {Drawable}
     */
    Drawable.prototype.setParent = function (parent) {
        if (this.parent !== null) {
            this.parent.removeChild(this);
        }
        this.parent = parent;
        return this;
    };
    /**
     *
     * @param {Number[]|{x:Number,y:Number}} coords
     * @returns {Drawable}
     */
    Drawable.prototype.setCoords = function (coords) {
        if (Array.isArray(coords)) {
            this.position.setX(coords[0]);
            this.position.setY(coords[1]);
        } else {
            this.position.setX(coords.x);
            this.position.setY(coords.y);
        }
        this.changed();
        return this;
    };
    /**
     *
     * @param {Vector2D} vector
     * @returns {Drawable}
     */
    Drawable.prototype.addCoords=function(vector){
        this.position.add(vector);
        this.changed();
        return this;
    };
    /**
     *
     * @param {PlayArea} playArea
     */
    Drawable.prototype.setPlayArea = function (playArea) {
        this.playArea = playArea;
        this.childrenabove.forEach(function (child) {
            child.setPlayArea(playArea);
        });
        this.childrenbelow.forEach(function (child) {
            child.setPlayArea(playArea);
        });
    };
    /**
     *
     * @returns {Array}
     */
    Drawable.prototype.getCoordArray = function () {
        return this.position.getCoordArray();
    };
    /**
     *
     * @returns {{x:Number,y:Number}}
     */
    Drawable.prototype.getCoordObj = function () {
        return this.position.getCoordObj();
    };
    /**
     *
     * @param {number} value in radians
     * @returns {Drawable}
     */
    Drawable.prototype.setAngle = function (value) {
        if (this.clamps.active && !this.clamps.absolute) {
            value = this.clamp(value);
        }
        this.rotation.setAngle(value);// + this.rotationOffset);
        //console.log(this.rotation.getAngleDegrees());
        this.changed();
        return this;
    };
    /**
     *
     * @param {number} value in radians
     * @returns {Vector2D}
     */
    Drawable.prototype.calcAngle = function (value) {
        if (this.clamps.active && !this.clamps.absolute) {
            value = this.clamp(value);
        }
        return this.rotation.cloneVector().setAngle(value);
    };
    /**
     *
     * @param {number} value in degrees
     * @returns {Drawable}
     */
    Drawable.prototype.setAngleDegrees = function (value) {
        this.rotation.setAngleDegrees(value);
        this.changed();
        return this;
    };
    /**
     *
     * @param {number} value in radians
     * @returns {Drawable}
     */
    Drawable.prototype.setAbsoluteAngle = function (value) {
        if (this.clamps.active && this.clamps.absolute) {
            value = this.clamp(value- (this.getAbsoluteAngle() - this.getAngle()));
        }else{
            value=value-(this.getAbsoluteAngle() - this.getAngle());
        }
        return this.setAngle(value );
    };
    /**
     *
     * @param {number} value in radians
     * @returns {Vector2D}
     */
    Drawable.prototype.calcAbsoluteAngle = function (value) {
        if (this.clamps.active && this.clamps.absolute) {
            value = this.clamp(value- (this.getAbsoluteAngle() - this.getAngle()));
        }else{
            value=value-(this.getAbsoluteAngle() - this.getAngle());
        }
        return this.calcAngle(value );
    };
    /**
     *
     * @param {number} value in degrees
     * @returns {Drawable}
     */
    Drawable.prototype.setAbsoluteAngleDegrees = function (value) {
        return this.setAbsoluteAngle(value * Math.PI / 180);
    };
    /**
     *
     * @returns {number} in radians
     */
    Drawable.prototype.getAngle = function () {
        return this.rotation.getAngle();
    };
    Drawable.prototype.getAngleDegrees = function () {
        return this.rotation.getAngleDegrees();
    };

    /**
     * enforces limits on angle
     * @param {Number} value
     * @returns {number}
     */
    Drawable.prototype.clamp = function (value) {
        var min = this.clamps.min;
        var max = this.clamps.max;
        value=value/Math.PI;
        value=((value%2)+2)%2;
        if(value<min){
            value+=2;
        }
        if (this.clamps.mid!==0 && value > this.clamps.mid) {
            if(min<max){
                value -= 2;
            }
        }
        if (this.clamps.mid!==0 && value < this.clamps.mid) {
            if(min>max){
                value += 2;
            }
        }
        if (Math.abs(min - value) < Math.abs(max - value)) {
            if (value < min) return min*Math.PI;
        } else if (value > max){
            return max*Math.PI;
        }
        return value*Math.PI;
    };
    /**
     *
     * @param {Drawable} object
     */
    Drawable.prototype.pointAt = function (object) {
        var vector;
        if (Array.isArray(object)) {
            vector = new Vector2D(object[0], object[1]);
        } else {
            vector = new Vector2D(object.x, object.y);
        }
        var v = vector.subtract(this.getAbsolutePosition());
        this.setAbsoluteAngle(v.getAngle());
    };
    /**
     *
     * @param {Drawable} object
     * @returns {Number}
     */
    Drawable.prototype.pointer = function (object) {
        var vector;
        if (Array.isArray(object)) {
            vector = new Vector2D(object[0], object[1]);
        } else {
            vector = new Vector2D(object.x, object.y);
        }
        var v = vector.subtract(this.getAbsolutePosition());
        return this.calcAbsoluteAngle(v.getAngle());
    };
    /**
     *
     * @param {Vector2D} [vector]
     * @returns {Vector2D}
     */
    Drawable.prototype.getAbsolutePosition = function (vector) {
        vector = vector || new Vector2D(0, 0);
        if (typeof this.parent !== "undefined" && this.parent !== null) {
            vector._x = vector._x * this.scaleX;
            vector._y = vector._y * this.scaleY;
            vector = vector.addAngle(this.rotation.getAngle()).add(this.position);
            return this.parent.getAbsolutePosition(vector);
        } else {
            return vector.addAngle(this.rotation.getAngle()).add(this.position);
        }
    };
    /**
     *
     * @param {Vector2D} [vector]
     * @returns {Vector2D}
     */
    Drawable.prototype.getAbsoluteRotation = function (vector) {
        vector = vector || new Vector2D(1, 0);
        if (typeof this.parent !== "undefined" && this.parent !== null) {
            vector = vector.addAngle(this.rotation.getAngle());
            return this.parent.getAbsoluteRotation(vector);
        } else {
            return vector.addAngle(this.rotation.getAngle());
        }
    };
    /**
     *
     * @returns {Number[]}
     */
    Drawable.prototype.getAbsoluteCoordArray = function () {
        return this.getAbsolutePosition().getCoordArray();
    };
    /**
     *
     * @returns {{x:Number,y:Number}}
     */
    Drawable.prototype.getAbsoluteCoordObj = function () {
        return this.getAbsolutePosition().getCoordObj();
    };
    /**
     *
     * @returns {Number} in radians
     */
    Drawable.prototype.getAbsoluteAngle = function () {
        return this.getAbsoluteRotation().getAngle();
    };
    /**
     *
     * @returns {Number} in degrees
     */
    Drawable.prototype.getAbsoluteAngleDegrees = function () {
        return this.getAbsoluteRotation().getAngleDegrees();
    };
    /**
     * to be called when you want to notify that something has changed that impacts redraw
     */
    Drawable.prototype.changed = function () {
        if (typeof this.playArea !== "undefined" && this.playArea !== null) {
            this.playArea.changed();
        }
    };
    Drawable.prototype.draw = function () {
    };

    Drawable.prototype._draw = function () {
        this.ctx.save();
        var position = this.position.getCoordObj();
        this.ctx.translate(position.x, position.y);
        if (this.alpha !== null) {
            this.ctx.globalAlpha = this.alpha;
        }
        this.ctx.scale(this.scaleX, this.scaleY);
        if(window.debug){
            if(this.clamps.active){
                var v=new Vector2D(1,0);
                var i=new Vector2D(1,0);
                var a=new Vector2D(1,0);
                v.setLength(50);
                i.setLength(100);
                a.setLength(100);
                v.setAngle(this.clamps.mid*Math.PI);//-(this.getAbsoluteAngle() + this.getAngle()));
                i.setAngle(this.clamps.min*Math.PI);
                a.setAngle(this.clamps.max*Math.PI);
                if(this.clamps.absolute){
                    v.addAngle(-this.getAbsoluteAngle()).addAngle(this.getAngle());
                    i.addAngle(-this.getAbsoluteAngle()).addAngle(this.getAngle());
                    a.addAngle(-this.getAbsoluteAngle()).addAngle(this.getAngle());
                }
                var posv= v.getCoordObj();
                var posi= i.getCoordObj();
                this.ctx.save();
                this.ctx.fillStyle="rgba(90,10,10,.2)";
                this.ctx.strokeStyle="#000000";
                this.ctx.beginPath();
                this.ctx.moveTo(posv.x, posv.y);
                this.ctx.lineTo(0,0);
                this.ctx.lineTo(posi.x, posi.y);
                this.ctx.arc(0,0,100, i.getAngle(), a.getAngle());
                this.ctx.lineTo(0, 0);
                this.ctx.stroke();
                this.ctx.fill();
                this.ctx.restore();
            }

        }
        this.ctx.rotate(this.rotation.getAngle());
        if(window.debug && this.collision.active){
            this.ctx.save();
            this.ctx.strokeStyle="#FF0000";
            this.ctx.alpha=0;
            this.ctx.moveTo(this.collision.x1,this.collision.y1);
            this.ctx.lineTo(this.collision.x2,this.collision.y1);
            this.ctx.lineTo(this.collision.x2,this.collision.y2);
            this.ctx.lineTo(this.collision.x1,this.collision.y2);
            this.ctx.lineTo(this.collision.x1,this.collision.y1);
            this.ctx.stroke();
            this.ctx.restore();
            /*this.ctx.save();
            this.ctx.strokeStyle="#0000FF";
            this.ctx.moveTo(this.collision.center._x,this.collision.center._y);
            this.ctx.arc(this.collision.center._x,this.collision.center._y, this.collision.length, 0, 2 * Math.PI, false);
            this.ctx.stroke();
            this.ctx.restore();*/
        }
        this.childrenbelow.forEach(function (child) {
            child.draw();
        });
        this.ctx.rotate(this.rotationOffset);
        if (this.drawSelf) {
            this.drawSelf();
        }
        this.ctx.rotate(-this.rotationOffset);
        this.childrenabove.forEach(function (child) {
            child.draw();
        });
        this.ctx.restore();
    };
    return Drawable;
})();
