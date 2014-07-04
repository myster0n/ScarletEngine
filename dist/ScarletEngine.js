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

var IKSolver=(function(){
"use strict";
    /**
     *
     * @param {Drawable} base = the unmoving base. Must be the (grand-grand-...) parent of the end piece
     * @param {Drawable} end = the end piece that gets moved to the target
     * @constructor
     */
    function IKSolver(base,end){
        this.segments=[];
        var segment=end;
        var length=0;
        this.totalLength=0;
        do{
            segment.IK={length:length};
            this.totalLength+=length;
            this.segments.push(segment);
            length=segment.position.getLength();
            segment=segment.parent;
            if(!(segment instanceof Drawable)){
                throw "Base not found";
            }
        }while(segment!==base);
        segment.IK={length:length};
        this.totalLength+=length;
        this.segments.push(segment);
    }

    /**
     *
     * @param {Vector2D} pos1
     * @param {Number} size1
     * @param {Vector2D} pos2
     * @param {Number} size2
     * @returns {Vector2D[]}
     */
    IKSolver.circleIntersect=function(pos1,size1,pos2,size2){
        var dx= pos2._x - pos1._x;
        var dy= pos2._y - pos1._y;
        var d = Math.sqrt((dy*dy) + (dx*dx));
        if(d>size1+size2){
            return null;
        }
        if(d<Math.abs(size1-size2)){
            return null;
        }
        // point2 = point on the line between intersections that crosses line between circle centers
        // a = distance from center of circle 1 to point2
        var a = ((size1*size1) - (size2*size2) + (d*d)) / (2.0 * d) ;

        // determine coordinates of point 2

        var x2= pos1._x+(dx*a/d);
        var y2= pos1._y+(dy*a/d);

        // h = distance from point2 to either intersection point
        var h=Math.sqrt((size1*size1)-(a*a));

        // determine offset of the intersect points from point 2

        var rx=-dy *(h/d);
        var ry=dx*(h/d);

        // absolute intersect points
        var i1=new Vector2D(x2+rx,y2+ry);
        var i2=new Vector2D(x2-rx,y2-ry);
        return [i1,i2];
    };
    /**
     *
     * @param {Number[]|{x: number,y: number}} object either an array with x and y coordinates, or an object with x and y properties.
     */
    IKSolver.prototype.bsolve=function(object){
        var vector;
        if (Array.isArray(object)) {
            vector = new Vector2D(object[0], object[1]);
        } else {
            vector = new Vector2D(object.x, object.y);
        }
        var tlen=this.totalLength;
        for(var i=this.segments.length-1;i>0;i--){
            var segment=this.segments[i];
            var s1=tlen/2;
            var s2=s1;
            if(s1<this.segments[i-1].IK.length){
                s1=this.segments[i-1].IK.length;
            }
            if(s2<segment.IK.length){
                s2=segment.IK.length;
            }
            var abs=segment.getAbsoluteCoordObj();
            var vec=new Vector2D(abs.x,abs.y);
            var res=IKSolver.circleIntersect(vector,s1,vec,s2);
            if(res===null){
                segment.pointAt(vector.getCoordObj());
            }else{
                segment.pointAt(res[0].getCoordObj());
            }
            tlen-=segment.IK.length;
        }

    };
    /**
     *
     * @param {Number[]|{x: number,y: number}} object either an array with x and y coordinates, or an object with x and y properties.
     */
    IKSolver.prototype.solve=function(object) {
        var vector;
        var segment;
        if (Array.isArray(object)) {
            vector = new Vector2D(object[0], object[1]);
        } else {
            vector = new Vector2D(object.x, object.y);
        }
        for(i=this.segments.length-1;i>=0;i--){
            segment=this.segments[i];
            segment.pointAt(vector.getCoordObj());
        }
        var pointTo=vector.cloneVector();
        var length=0;
        for(var i=0;i<this.segments.length;i++){
            segment=this.segments[i];
            var coords=segment.getAbsoluteCoordObj();
            var segvector=new Vector2D(coords.x,coords.y);
            var angle=Vector2D.angleBetween(pointTo,segvector);
            var newpos=new Vector2D(-1,0);
            newpos.setAngle(angle);
            newpos.setLength(length);
            pointTo.add(newpos);
            this.segments[i].newposition=pointTo.cloneVector();

            length=segment.position.getLength();
        }
        for(i=this.segments.length-1;i>=0;i--){
            segment=this.segments[i];
            //var nextsegment=this.segments[i-1];
            var nexcoort=(i>0)?this.segments[i-1].newposition.getCoordObj():vector.getCoordObj();
            segment.pointAt(nexcoort);
        }

    };
    return IKSolver;
})();
if(!Math.TAU){
    Math.TAU=2*Math.PI;
}
if(!Math.squared){
    /**
     *
     * @param {number} num
     * @returns {number}
     */
    Math.squared=function(num){return num*num;};
}
if(!Math.isOverlapping){
    /**
     *
     * @param {number} xmin
     * @param {number} xmax
     * @param {number} ymin
     * @param {number} ymax
     * @returns {boolean}
     */
    Math.isOverlapping=function(xmin,xmax,ymin,ymax){
        return Math.max(xmin,ymin) <= Math.min(xmax,ymax);
    };
}
if(!Math.toRadians){
    /**
     *
     * @param {number} value in degrees
     * @returns {number} in radians
     */
    Math.toRadians=function(value){
        return value * Math.PI / 180;
    };
}
if(!Math.rnd){
    /**
     * If only num1 is present, calculates random integer from 0 to num1 (inclusive), otherwise from num1 to num2 (inclusive)
     * @param {Number} num1
     * @param {Number} [num2]
     * @returns {Number}
     */
    Math.rnd=function(num1,num2){
        if(num2){
            num2++;
            return Math.floor(Math.random()*(num2-num1))+num1;
        }
        num1++;
        return Math.floor(Math.random()*num1);
    };
}
var Mural = (function () {
"use strict";
    /**
     *
     * @param {String} selector CSS selector for your canvas element
     * @param {boolean} [smooth] turn on image smoothing (default off)
     * @param {boolean} [immediate] if true, redraw the image when receiving a change, otherwise wait until redraw is called (default false)
     * @constructor
     */
    function Mural(selector, smooth, immediate) {
        this.canvas = document.querySelector(selector);
        this.context = this.canvas.getContext("2d");
        this.smooth = smooth;
        this.context.imageSmoothingEnabled = !!smooth;
        this.context.mozImageSmoothingEnabled = !!smooth;
        this.context.oImageSmoothingEnabled = !!smooth;
        this.context.webkitImageSmoothingEnabled = !!smooth;
        this.playAreas = [];
        this.immediate = !!immediate;
        this.hasChanged = false;
        this.mouseposition = {x: 0, y: 0};
        this.canvas.addEventListener('mousemove', this.mousePos.bind(this));
        this.animlist=[];
    }

    /**
     * hide mouse pointer
     */
    Mural.prototype.hidePointer=function(){
        this.canvas.style.cursor="none";
    };
    /**
     * show mouse pointer
     */
    Mural.prototype.showPointer=function(){
        this.canvas.style.cursor="default";
    };
    Mural.prototype.mousePos = function (evt) {
        var rect = this.canvas.getBoundingClientRect();
        this.mouseposition = {x: evt.clientX - rect.left, y: evt.clientY - rect.top};
    };
    /**
     *
     * @returns {{x: number, y: number}} mouse coordinates relative to mural
     */
    Mural.prototype.getMousePosition = function () {
        return this.mouseposition;
    };
    /**
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @returns {PlayArea}
     */
    Mural.prototype.addPlayArea = function (x, y, width, height) {
        x = x || 0;
        y = y || 0;
        width = this.context.canvas.width || 0;
        height = height || this.context.canvas.height;
        var m_canvas = document.createElement("canvas");
        m_canvas.width = width;
        m_canvas.height = height;
        var playArea = new PlayArea(m_canvas, x, y, this.smooth, this.immediate);
        this.playAreas.push(playArea);
        playArea.setParent(this);
        this.changed();
        return playArea;
    };
    /**
     * gets called by children to notify that there has been a visual change
     */
    Mural.prototype.changed = function () {
        this.hasChanged = true;
        if (this.immediate) {
            setTimeout(this.redraw.bind(this), 0);
        }
    };
    /**
     * redraw the canvas element if something has changed or if force = true
     * @param {boolean} [force]
     */
    Mural.prototype.redraw = function (force) {
        if (this.hasChanged || force) {
            this.draw(force);
            this.hasChanged = false;
        }
    };
    /**
     * make playAreas redraw themselves if changed or if force = true
     * @param {boolean} [force]
     */
    Mural.prototype.draw = function (force) {
        this.context.moveTo(0, 0);
        this.playAreas.forEach(function (playArea) {
            playArea.draw(force);
        });
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        var that = this;
        this.playAreas.forEach(function (playArea) {
            that.context.drawImage(playArea.canvas, playArea.x, playArea.y);
        });
    };
    /**
     * add sprite to list of sprites that has to be animated automatically
     * @param {Sprite} object
     */
    Mural.prototype.animate=function(object){
        if(this.animlist.indexOf(object)===-1){
            this.animlist.push(object);
        }
    };
    /**
     * remove sprite to list of sprites that has to be animated automatically
     * @param {Sprite} object
     */
    Mural.prototype.removeAnimation=function(object){
        if(this.animlist.indexOf(object)!==-1){
            this.animlist.splice(this.animlist.indexOf(object),1);
        }
    };
    return Mural;
})();
var PlayArea = (function () {
"use strict";
    /**
     *
     * @param canvas
     * @param x
     * @param y
     * @param smooth
     * @param immediate
     * @constructor
     */
    function PlayArea(canvas, x, y, smooth, immediate) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = !!smooth;
        this.ctx.mozImageSmoothingEnabled = !!smooth;
        this.ctx.oImageSmoothingEnabled = !!smooth;
        this.ctx.webkitImageSmoothingEnabled = !!smooth;
        this.x = x;
        this.y = y;
        this.immediate = immediate;
        this.objects = [];
        this.hasChanged = false;
    }

    /**
     * get mouse position relative to this playArea
     * @returns {{x: number, y: number}}
     */
    PlayArea.prototype.getMousePosition = function () {
        var mp = this.parent.getMousePosition();
        mp.x -= this.x;
        mp.y -= this.y;
        return mp;
    };
    /**
     *
     * @param {Drawable} child
     * @param {number} [level] higher levels get drawn on top of lower levels
     */
    PlayArea.prototype.addChild = function (child,level) {
        level=level||0;
        if(!this.objects[level]){
            this.objects[level]=[];
        }
        this.objects[level].push(child);
        child.setParent(this);
        child.setContext(this.ctx);
        child.setPlayArea(this);
    };
    /**
     *
     * @param {Drawable} child
     */
    PlayArea.prototype.removeChild = function (child) {
        var result= this.objects.some(function(level){
            if(level.indexOf(child)>-1){
                level.splice(level.indexOf(child),1);
                return true;
            }
        });
        if(result!==true){
            throw "Child not found";
        }
    };
    /**
     *
     * @param {Mural} parent
     */
    PlayArea.prototype.setParent = function (parent) {
        this.parent = parent;
    };
    /**
     * called by child elements to indicate something visible has changed
     */
    PlayArea.prototype.changed = function () {
        this.hasChanged = true;
        if (typeof this.parent !== "undefined" && this.parent !== null) {
            this.parent.changed();
        }
    };
    /**
     * draw all children if something has changed or force = true
     * @param {boolean} [force]
     */
    PlayArea.prototype.draw = function (force) {
        if (this.hasChanged || force) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.moveTo(0, 0);
            this.objects.forEach(function (level) {
                level.forEach(function(object){
                    object.draw();
                });
            });
            this.hasChanged = false;
        }
    };
    PlayArea.prototype.getAbsolutePosition = function (vector) {
        return vector;
    };
    PlayArea.prototype.getAbsoluteRotation = function (vector) {
        return vector;
    };
    PlayArea.prototype.getAbsoluteAngle = function () {
        return 0;
    };
    /**
     *
     * @param {Drawable} object
     */
    PlayArea.prototype.animate=function(object){
        this.parent.animate(object);
    };
    /**
     *
     * @param {Drawable} object
     */
    PlayArea.prototype.removeAnimation = function(object){
        this.parent.removeAnimation(object);
    };
    return PlayArea;
})();

var Poly = (function () {
"use strict";
    /**
     *
     * @param {Number} centerX
     * @param {Number} centerY
     * @constructor
     */
    function Poly(centerX, centerY) {
        centerX = centerX || 0;
        centerY = centerY || 0;
        Drawable.apply(this, [centerX, centerY]);
        this.points = [];
        this._fillStyle = null;
        this._lineWidth = null;
        this._shadow = null;
        this._strokeStyle = null;
    }
    Poly.prototype = Object.create(Drawable.prototype);

    /**
     * adds a point to the polygon
     * @param {Number} x
     * @param {Number} y
     * @returns {Poly}
     */
    Poly.prototype.addPoint = function (x, y) {
        this.points.push([x, y]);
        this.changed();
        return this;
    };
    /**
     *
     * @param {Number} value
     * @returns {Number[]}
     */
    Poly.prototype.getPoint = function (value) {
        if (value >= 0 && value < this.points.length) {
            return this.points[value];
        }
        return null;
    };
    /**
     * change the nth point of the polygon. Either enter x and y as separate values or use an [x,y] array.
     * @param {Number} value
     * @param {Number|Number[]} x
     * @param {Number} [y]
     * @returns {Poly}
     */
    Poly.prototype.changePoint = function (value, x, y) {
        if (value >= 0 && value < this.points.length) {
            if (!Array.isArray(x)) {
                x = [x, y];
            }
            this.points[value] = x;
        }
        this.changed();
        return this;
    };
    /**
     *
     * @param {String} fillStyle
     * @returns {Poly}
     */
    Poly.prototype.fillStyle = function (fillStyle) {
        this._fillStyle = fillStyle;
        this.changed();
        return this;
    };
    /**
     *
     * @param {String} pattern is image.src
     */
    Poly.prototype.usePattern = function(pattern){
        this.pattern=new Image();
        this.pattern.src=pattern;
        this.loaded=false;
        this.pattern.addEventListener('load',function(){this.loaded=true;}.bind(this));

    };
    /**
     * to move the origin of the pattern
     * @param {Number} x
     * @param {Number} y
     */
    Poly.prototype.patternTranslate=function(x,y){
        if(typeof this.translate === "undefined" || this.translate===null){
            this.translate={x:0,y:0};
        }
        this.translate.x=x||this.translate.x;
        this.translate.y=y||this.translate.y;
    };
    /**
     * to move the origin of the pattern, relative to the current position
     * @param {Number} x
     * @param {Number} y
     */
    Poly.prototype.relativePatternTranslate=function(x,y){
        if(typeof this.translate === "undefined" || this.translate===null){
            this.translate={x:0,y:0};
        }
        if(x)this.translate.x=this.translate.x+x;
        if(y)this.translate.y=this.translate.y+y;
    };
    /**
     *
     * @param lineWidth
     * @returns {Poly}
     */
    Poly.prototype.lineWidth = function (lineWidth) {
        this._lineWidth = lineWidth;
        this.changed();
        return this;
    };
    /**
     *
     * @param strokeStyle
     * @returns {Poly}
     */
    Poly.prototype.strokeStyle = function (strokeStyle) {
        this._strokeStyle = strokeStyle;
        this.changed();
        return this;
    };
    /**
     *
     * @param shadow
     * @returns {Poly}
     */
    Poly.prototype.shadow = function (shadow) {
        this._shadow = shadow;
        this.changed();
        return this;
    };
    Poly.prototype.drawSelf = function () {
        var ctx = this.ctx;
        if(this.pattern!==null && this.loaded){
            ctx.fillStyle=ctx.createPattern(this.pattern,"repeat");
        }else {
            if (this._fillStyle !== null) {
                ctx.fillStyle = this._fillStyle;
            }
        }
        if (this._lineWidth !== null) {
            ctx.lineWidth = this._lineWidth;
        }
        if (this._strokeStyle !== null) {
            ctx.strokeStyle = this._strokeStyle;
        }
        if (this._shadow !== null) {
            ctx.shadowOffsetX = this._shadow.x;
            ctx.shadowOffsetY = this._shadow.y;
            ctx.shadowBlur = this._shadow.blur;
            ctx.shadowColor = this._shadow.color;
        }
        ctx.beginPath();
        var that = this;
        this.points.forEach(function (point) {
            ctx.lineTo(point[0] - that.centerX, point[1] - that.centerY);
        });
        if (this.points.length > 2) {
            ctx.lineTo(this.points[0][0] - this.centerX, this.points[0][1] - this.centerY);
        }
        if (this._strokeStyle !== null) {
            ctx.stroke();
        }
        if ((this._fillStyle !== null || this.pattern!==null)&& this.points.length > 2) {
            if(this.translate){
                ctx.save();
                ctx.translate(this.translate.x,this.translate.y);
            }
            ctx.fill();
            if(this.translate){
                ctx.restore();
            }
        }

    };

    return Poly;
})();

var ScarletEngine = (function () {
"use strict";
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    /**
     *
     * @param {Mural} mural
     * @param {Function} [gameloop] gets called every frame
     * @constructor
     */
    function ScarletEngine(mural, gameloop) {
        this.mural = mural;
        this.gameloop = gameloop||ScarletEngine.defaultLoop;
        this.startTime = null;
        this.prevtime = null;
        this.run = true;
        this.keys={};
        this.frameLength=1000/60;
        this.ticksover=0;
        this.totalticksover=0;
        this.keyCodes=[];
        document.addEventListener("keydown",this.keyDown.bind(this));
        document.addEventListener("keyup",this.keyUp.bind(this));
    }
    ScarletEngine.prototype.registerKeys=function(keylist){
        keylist.forEach(this.registerKey.bind(this));
    };
    ScarletEngine.prototype.registerKey=function(keyCode){
        if(this.keyCodes.indexOf(keyCode)===-1){
            this.keyCodes.push(keyCode);
        }
    };
    ScarletEngine.prototype.releaseKey=function(keyCode){
        if(this.keyCodes.indexOf(keyCode)!==-1){
            this.keyCodes.splice(this.keys.indexOf(keyCode),1);
        }
    };
    ScarletEngine.prototype.keyDown=function(evt){
        var charCode = (evt.which) ? evt.which : event.keyCode;
        if(this.keyCodes.indexOf(charCode)!==-1){
            this.keys[charCode]="new";
            evt.stopPropagation();
            evt.preventDefault();
        }
    };
    ScarletEngine.prototype.keyUp=function(evt){
        var charCode = (evt.which) ? evt.which : event.keyCode;
        delete this.keys[''+charCode];
        if(this.keyCodes.indexOf(charCode)!==-1){
            evt.stopPropagation();
            evt.preventDefault();
        }
    };
    /**
     * check key press
     * @param {Number} key keyCode to test
     * @param {boolean} [single] if true it will return false if there was no keyup previously. So a switch between continuous and single keystroke
     * @returns {boolean}
     */
    ScarletEngine.prototype.isKey=function(key,single){
        single=!!single;
        var k=this.keys[key];
        var res=false;
        if(k){
            if(k=="new"){
                res=true;
            }else if(!single){
                res=true;
            }
            this.keys[key]="old";
        }
        return res;
    };
    ScarletEngine.defaultLoop=function(progress){};

    /**
     * The main loop of the engine. This will be called automatically by window.requestAnimationFrame, run your custom gameloop (if present) and updates the canvas
     * The custom gameloop is provided with an object which has the following properties :
     * progress : time in ms since game start
     * moment : amount of ms since last loop
     * ticks : amount of 'ticks' (60th of a second - an integer) since last loop
     * totalTicks : amount of 'ticks' (60th of a second - an integer) since game start
     * isKey : function (see isKey)
     * @param timestamp
     */
    ScarletEngine.prototype.mainLoop = function (timestamp) {
        var progress;
        var moment;
        if (this.startTime === null) this.startTime = timestamp;
        if (this.prevtime === null) this.prevtime = timestamp;
        progress = timestamp - this.startTime;
        moment = timestamp - this.prevtime;
        this.prevtime = timestamp;
        var ticks=Math.round((moment+this.ticksover)/this.frameLength);
        this.ticksover=moment+this.ticksover-(ticks*this.frameLength);
        var totalTicks=Math.round((progress+this.totalticksover)/this.frameLength);
        this.totalticksover=progress+this.totalticksover-(totalTicks*this.frameLength);
        for(var i=0;i<this.mural.animlist.length;i++){
            this.mural.animlist[i].addTicks(ticks);
        }

        this.gameloop({progress:progress, moment:moment,ticks:ticks,totalTicks:totalTicks,isKey:this.isKey.bind(this)});
        this.mural.redraw();
        if (this.run) {
            //noinspection JSCheckFunctionSignatures
            window.requestAnimationFrame(this.mainLoop.bind(this));
        }
    };
    /**
     * start game loop
     */
    ScarletEngine.prototype.start = function () {
        this.run = true;
        this.startTime = null;
        this.prevtime = null;
        //noinspection JSCheckFunctionSignatures
        window.requestAnimationFrame(this.mainLoop.bind(this));
    };
    /**
     * stop game loop
     */
    ScarletEngine.prototype.stop = function () {
        this.run = false;
    };
    return ScarletEngine;
})();

var Sprite = (function () {
"use strict";

    /**
     *
     * @param {String} image
     * @param {Number} width
     * @param {Number} height
     * @param {Number} centerX
     * @param {Number} centerY
     * @param {Number} [rotationOffset]
     * @constructor
     */
    function Sprite(image, width, height, centerX, centerY,rotationOffset) {
        Drawable.apply(this, [centerX, centerY,rotationOffset]);
        this.image = new Image();
        this.loaded=false;
        this.image.addEventListener('load',function(){this.loaded=true;this.tileWidth=Math.floor(this.image.width/this.width);}.bind(this));
        this.image.src = image;
        this.width = width;
        this.height = height;
        this.frame=0;
        this.animations={};
        this.currentAnimation=null;
        this.animationIndex=0;
        this.tickSpeed=1;
        this.tick=0;
    }
    Sprite.prototype = Object.create(Drawable.prototype);

    /**
     * sets the animation frame
     * @param {Number} frame
     * @returns {Sprite}
     */
    Sprite.prototype.setFrame=function(frame){
        this.frame=frame;
        this.changed();
        return this;
    };
    /**
     * sets the animation speed (how many ticks until frame change). Lower is faster
     * @param {Number} tickSpeed
     * @returns {Sprite}
     */
    Sprite.prototype.setSpeed=function(tickSpeed){
        this.tickSpeed=tickSpeed;
        return this;
    };
    /**
     * this amount of ticks has passed, recalculate which animation frame to show
     * @param {Number} ticks
     * @returns {Sprite}
     */
    Sprite.prototype.addTicks=function(ticks){
        this.tick+=ticks;
        while(this.tick>this.tickSpeed){
            this.advanceAnimationFrame();
            this.tick-=this.tickSpeed;
        }
        return this;
    };
    /**
     * set or remove sprite from auto anim list
     * @param {boolean} value
     * @returns {Sprite}
     */
    Sprite.prototype.autoAnim=function(value){
        if(value){
            this.playArea.animate(this);
        }else{
            this.playArea.removeAnimation(this);
        }
        return this;
    };
    /**
     *
     * @param {String} name
     * @param {Number[]} frames if one of the numbers is -1, the animation stops there.
     * @param {Function} [callback] called either on every loop or when the animation stops
     * @returns {Sprite}
     */
    Sprite.prototype.addAnimation=function(name,frames,callback){

        callback=callback||function(){};
        this.animations[name]={frames:frames,callback:callback};
        return this;
    };
    /**
     *
     * @param {String} name previously named animation
     * @param callback [callback] called either on every loop or when the animation stops
     * @returns {Sprite}
     */
    Sprite.prototype.setAnimationCallback=function(name,callback){
        if(this.animations[name]){
            this.animations[name].callback=callback;
        }
        return this;
    };
    /**
     * Starts animation with predefined name
     * @param {String} name
     * @returns {Sprite}
     */
    Sprite.prototype.startAnimation=function(name){
        if(this.animations[name]){
            this.currentAnimation=this.animations[name];
            this.animationIndex=0;
        }
        return this;
    };
    /**
     *
     * @returns {Sprite}
     */
    Sprite.prototype.stopAnimation=function(){
        this.currentAnimation=null;
        return this;
    };
    /**
     * advance to the next frame in the current animation
     * @returns {Sprite}
     */
    Sprite.prototype.advanceAnimationFrame=function(){
        if(this.currentAnimation!==null){
            this.animationIndex++;
            if(this.animationIndex>=this.currentAnimation.frames.length){
                setTimeout(function(){this.currentAnimation.callback.call(null,this);}.bind(this),0);
                this.animationIndex=0;
            }
            if(this.currentAnimation.frames[this.animationIndex]===-1){
                var callback=this.currentAnimation.callback;
                this.stopAnimation();
                setTimeout(function(){callback.call(null,this);}.bind(this),0);
            }else{
                this.frame=this.currentAnimation.frames[this.animationIndex];
            }

        }
        return this;
    };


    Sprite.prototype.drawSelf = function () {
        if (!this.loaded)return;
        var sx=this.frame;
        var sy=0;
        while(sx>=this.tileWidth){
            sy++;
            sx-=this.tileWidth;
        }
        this.ctx.drawImage(this.image, // image
            sx*this.width,sy*this.height, // source coords
            this.width,this.height, // source size
            -this.centerX, -this.centerY, // draw coords
            this.width,this.height // draw size
        );
    };
    return Sprite;
})();

/**
 * Converted from actionscript found on http://rocketmandevelopment.com/
 */
var Vector2D= (function(){
"use strict";
    /**
     *
     * @param {Number} x
     * @param {Number} y
     * @constructor
     */
    function Vector2D(x,y){
        this._x=x||0;
        this._y=y||0;
    }
    /**
     * Set y component.
     * @param {Number} value
     */
    Vector2D.prototype.setY=function(value){
        this._y = value;
    };
    /**
     * get y component.
     * @returns {Number}
     */
    Vector2D.prototype.getY=function(){
        return this._y;
    };

    /**
     * Set x component.
     * @param {Number} value
     */
    Vector2D.prototype.setX=function(value){
        this._x = value;
    };
    /**
     * get x component.
     * @returns {Number}
     */
    Vector2D.prototype.getX=function(){
        return this._x;
    };

    /**
     * returns both x and y as an array
     * @return {Number[]}
     */
    Vector2D.prototype.getCoordArray=function(){
        return [this._x,this._y];
    };
    /**
     * returns both x and y as an object
     * @return {{x:Number,y:Number}}
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
     * @param {Vector2D} vector2 The vector to test.
     * @return Boolean True if equal, false if not.
     */
    Vector2D.prototype.equals=function(vector2){
        return this._x == vector2.getX() && this._y == vector2.getY();
    };
    /**
     * Returns the length of this vector, before square root. Allows for a faster check.
     * @return {Number}
     */
    Vector2D.prototype.getLengthSquared=function(){
        return Math.squared(this._x)+Math.squared(this._y);
    };
    /**
     * Returns the length of the vector.
     * @return {Number}
     **/
    Vector2D.prototype.getLength=function(){
        return Math.sqrt(this.getLengthSquared());
    };
    /**
     * Sets the length which will change x and y, but not the angle.
     * @param {Number} value
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
     * @param {Number} value
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
     * @param {Number} value
     * @returns {Vector2D}
     */
    Vector2D.prototype.setAngleDegrees=function(value){
        return this.setAngle(value*Math.PI/180);
    };
    /**
     * Add an angle (radians value) to the current angle
     * @param {Number} value
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
     * @param {Number} value
     * @returns {Vector2D}
     */
    Vector2D.prototype.addAngleDegrees=function(value){
        return this.addAngle(value*Math.PI/180);
    };
    /**
     * Sets the vector's length to 1.
     * @return {Vector2D} This vector.
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
     * @param {Number} len The length to set it to.
     * @return {Vector2D} This vector.
     */
    Vector2D.prototype.normalcate = function(len){
        this.setLength(len);
        return this;
    };
    /**
     * Sets the length under the given value. Nothing is done if the vector is already shorter.
     * @param {Number} max The max length this vector can be.
     * @return {Vector2D} This vector.
     */
    Vector2D.prototype.truncate = function(max){
        this.setLength(Math.min(max,this.getLength()));
        return this;
    };
    /**
     * Makes the vector face the opposite way.
     * @return {Vector2D} This vector.
     */
    Vector2D.prototype.reverse = function(){
        this._x=-this._x;
        this._y=-this._y;
        return this;
    };
    /**
     * Calculate the dot product of this vector and another.
     * @param {Vector2D} vector2 Another vector2D.
     * @return {Number} The dot product.
     */
    Vector2D.prototype.dotProduct=function(vector2){
        return this._x*vector2._x + this._y*vector2._y;
    };
    /**
     * Calculate the cross product of this and another vector.
     * @param {Vector2D} vector2 Another Vector2D.
     * @return {Number} The cross product.
     */
    Vector2D.prototype.crossProduct=function(vector2){
        return this._x*vector2._y - this._y*vector2._x;
    };
    /**
     * Calculate angle between any two vectors.
     * @param {Vector2D} vector1 First vector2d.
     * @param {Vector2D} vector2 Second vector2d.
     * @return {Number} Angle between vectors.
     */
    Vector2D.angleBetween = function(vector1,vector2){
        if(!vector1.isNormalized()) vector1=vector1.cloneVector().normalize();
        if(!vector2.isNormalized()) vector2=vector2.cloneVector().normalize();
        return Math.acos(vector1.dotProduct(vector2));
    };
    /**
     * Get the vector that is perpendicular.
     * @return {Vector2D} The perpendicular vector.
     */
    Vector2D.prototype.getPerpendicular = function(){
        //noinspection JSSuspiciousNameCombination
        return new Vector2D(-this._y,this._x);
    };
    /**
     * Is the vector to the right or left of this one?
     * @param {Vector2D} vector2 The vector to test.
     * @return {Boolean} If left, returns true, if right, false.
     */
    Vector2D.prototype.sign=function(vector2){
        return this.getPerpendicular().dotProduct(vector2)<0;
    };
    /**
     * Calculate distance between two vectors.
     * @param {Vector2D} vector2 The vector to find distance.
     * @return {Number} The distance.
     */
    Vector2D.prototype.distance=function(vector2){
        return Math.sqrt(this.distSQ(vector2));
    };
    /**
     * Calculate squared distance between vectors. Faster than distance.
     * @param {Vector2D} vector2 The other vector.
     * @return {Number} The squared distance between the vectors.
     */
    Vector2D.prototype.distSQ=function(vector2){
        var dx=vector2.getX()-this._x;
        var dy=vector2.getY()-this._y;
        return Math.squared(dx)+Math.squared(dy);
    };
    /**
     * Add a vector to this vector.
     * @param {Vector2D} vector2 The vector to add to this one.
     * @return {Vector2D} This vector.
     */
    Vector2D.prototype.add=function(vector2){
        this._x+=vector2.getX();
        this._y+=vector2.getY();
        return this;
    };
    /**
     * Subtract a vector from this one.
     * @param {Vector2D} vector2 The vector to subtract.
     * @return {Vector2D} This vector.
     */
    Vector2D.prototype.subtract=function(vector2){
        this._x-=vector2.getX();
        this._y-=vector2.getY();
        return this;
    };
    /**
     * Multiplies this vector by a scalar.
     * @param {Number} scalar The scalar to multiply by.
     * @return {Vector2D} This vector, multiplied.
     */
    Vector2D.prototype.multiply=function(scalar){
        this._x*=scalar;
        this._y*=scalar;
        return this;
    };
    /**
     * Divides this vector by a scalar.
     * @param {Number} scalar The scalar to multiply by.
     * @return {Vector2D} This vector, multiplied.
     */
    Vector2D.prototype.divide=function(scalar){
        this._x/=scalar;
        this._y/=scalar;
        return this;
    };

    return Vector2D;
})();