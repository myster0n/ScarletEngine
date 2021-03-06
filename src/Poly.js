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
