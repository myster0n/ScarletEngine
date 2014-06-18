
var IKSolver=(function(){
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
            if(res==null){
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
            var segment=this.segments[i];
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