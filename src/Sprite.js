
var Sprite = (function () {
    Sprite.prototype = Object.create(Drawable.prototype);

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
        this.image.addEventListener('load',function(){this.loaded=true;this.tileWidth=Math.floor(this.image.width/this.width)}.bind(this));
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

    Sprite.prototype.setFrame=function(frame){
        this.frame=frame;
        this.changed();
        return this;
    };
    Sprite.prototype.setSpeed=function(tickSpeed){
        this.tickSpeed=tickSpeed;
        return this;
    };
    Sprite.prototype.addTicks=function(ticks){
        this.tick+=ticks;
        while(this.tick>this.tickSpeed){
            this.advanceAnimationFrame();
            this.tick-=this.tickSpeed;
        }
        return this;
    };
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
     * @param {Number[]} frames
     * @param {Function} [callback]
     * @returns {Sprite}
     */
    Sprite.prototype.addAnimation=function(name,frames,callback){

        callback=callback||function(){};
        this.animations[name]={frames:frames,callback:callback};
        return this;
    };
    Sprite.prototype.setAnimationCallback=function(name,callback){
        if(this.animations[name]){
            this.animations[name].callback=callback;
        }
        return this;
    };
    Sprite.prototype.startAnimation=function(name){
        if(this.animations[name]){
            this.currentAnimation=this.animations[name];
            this.animationIndex=0;
        }
        return this;
    };
    Sprite.prototype.stopAnimation=function(){
        this.currentAnimation=null;
        return this;
    };
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
