var ScarletEngine = (function () {
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
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
        document.addEventListener("keydown",this.keyDown.bind(this));
        document.addEventListener("keyup",this.keyUp.bind(this));
    }
    ScarletEngine.prototype.keyDown=function(evt){
        var charCode = (evt.which) ? evt.which : event.keyCode;
        this.keys[charCode]="new";
        evt.stopPropagation();
        evt.preventDefault();
    };
    ScarletEngine.prototype.keyUp=function(evt){
        var charCode = (evt.which) ? evt.which : event.keyCode;
        delete this.keys[''+charCode];
        evt.stopPropagation();
        evt.preventDefault();
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
