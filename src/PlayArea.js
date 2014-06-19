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
