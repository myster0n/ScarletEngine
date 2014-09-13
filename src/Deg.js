var Deg=Object.procreate(null,{},{
    normalize:function(degrees){
        if(degrees<0){
            degrees+=Math.abs(Math.floor(degrees/360))*360;
        }
        if(degrees>360){
            degrees-=Math.abs(Math.floor(degrees/360))*360;
        }
        return degrees;
    },
    isWithinRange:function(start,end,angle){
        if(Math.abs(end-start)>=360){
            return true;
        }
        var degrees=Deg.normalize(angle);
        var startDegrees=Deg.normalize(start);
        if(startDegrees>degrees){
            startDegrees-=360;
        }
        var endDegrees=Deg.normalize(end);
        if(endDegrees<startDegrees){
            endDegrees+=360;
        }else if((endDegrees-startDegrees)>=360){
            endDegrees-=360;
        }
        return !((degrees < startDegrees) || (degrees > endDegrees));

    },
    toRadians:function(degrees){
        return degrees * Math.PI / 180;
    }
});