
var Mural = (function () {
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
    Mural.prototype.changed = function () {
        this.hasChanged = true;
        if (this.immediate) {
            setTimeout(this.redraw.bind(this), 0);
        }
    };
    Mural.prototype.redraw = function (force) {
        if (this.hasChanged || force) {
            this.draw(force);
            this.hasChanged = false;
        }
    };
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
    Mural.prototype.animate=function(object){
        if(this.animlist.indexOf(object)===-1){
            this.animlist.push(object);
        }
    };
    Mural.prototype.removeAnimation=function(object){
        if(this.animlist.indexOf(object)!==-1){
            this.animlist.splice(this.animlist.indexOf(object),1);
        }
    };
    return Mural;
})();