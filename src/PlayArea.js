var PlayArea = (function () {
"use strict";
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

    PlayArea.prototype.getMousePosition = function () {
        var mp = this.parent.getMousePosition();
        mp.x -= this.x;
        mp.y -= this.y;
        return mp;
    };
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
    PlayArea.prototype.removeChild = function (sprite) {
        if (this.objects.indexOf(sprite) > -1) {
            this.objects.splice(this.objects.indexOf(sprite), 1);
        }
    };
    PlayArea.prototype.setParent = function (parent) {
        this.parent = parent;
    };
    PlayArea.prototype.changed = function () {
        this.hasChanged = true;
        if (typeof this.parent !== "undefined" && this.parent !== null) {
            this.parent.changed();
        }
    };
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
    PlayArea.prototype.animate=function(object){
        this.parent.animate(object);
    };
    PlayArea.prototype.removeAnimation = function(object){
        this.parent.removeAnimation(object);
    };
    return PlayArea;
})();
