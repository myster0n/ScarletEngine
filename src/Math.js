if(!Math.TAU){
    Math.TAU=2*Math.PI;
}
if(!Math.squared){
    Math.squared=function(num){return num*num;};
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