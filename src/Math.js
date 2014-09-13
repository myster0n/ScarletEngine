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