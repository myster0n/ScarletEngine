Drawable(centerX, centerY, \[rotationOffset\])
----------------------------------------------
**Parameters**

**centerX**:  *Number*,  


**centerY**:  *Number*,  


**[rotationOffset]**:  *Number*,  


setCollisionBox(x1, y1, x2, y2, \[fromZero\])
---------------------------------------------
**Parameters**

**x1**:  *Number*,  


**y1**:  *Number*,  


**x2**:  *Number*,  


**y2**:  *Number*,  


**[fromZero]**:  *Boolean*,  


collisionMode(active)
---------------------
**Parameters**

**active**:  *boolean*,  


getAbsoluteCollisionBox()
-------------------------
getAbsoluteCollisionCircle()
----------------------------
**Returns**

*{center: Vector2D, length: Number*,  }

collidesWith(object)
--------------------
**Parameters**

**object**:  *Drawable*,  


rectCollidesWithRect(object)
----------------------------
**Parameters**

**object**:  *Drawable*,  


isPointingAt(object, \[margin\])
--------------------------------
**Parameters**

**object**:  *Drawable|Sprite|Poly*,  


**[margin]**:  *Number*,  


setContext(context)
-------------------
**Parameters**

**context**:  *CanvasRenderingContext2D*,  


setRotationOffset(value)
------------------------
**Parameters**

**value**:  *Number*,  


setRotationOffsetDegrees(value)
-------------------------------
**Parameters**

**value**:  *Number*,  


setClamps(min, max, \[absolute\])
---------------------------------
set clamps in radians


**Parameters**

**min**:  *Number*,  


**max**:  *Number*,  


**[absolute]**:  *Boolean*,  


setClampsPI(min, max, \[absolute\])
-----------------------------------
As radians goes from 0 to 2*PI, this goes from 0 to 2


**Parameters**

**min**:  *Number*,  


**max**:  *Number*,  


**[absolute]**:  *Boolean*,  


setClampsDegrees(min, max, \[absolute\])
----------------------------------------
set clamps in degrees


**Parameters**

**min**:  *Number*,  


**max**:  *Number*,  


**[absolute]**:  *Boolean*,  


removeClamps()
--------------
setAlpha(value)
---------------
**Parameters**

**value**:  *Number*,  


setScale(x, \[y\])
------------------
**Parameters**

**x**:  *Number*,  


**[y]**:  *Number*,  


addChild(child, \[above\])
--------------------------
**Parameters**

**child**:  *Drawable*,  


**[above]**:  *Boolean*,  


removeChild(child)
------------------
**Parameters**

**child**:  *Drawable*,  


kill()
------
kills all the children and removes itself from the parent


setParent(parent)
-----------------
**Parameters**

**parent**:  *Drawable | PlayArea*,  


setCoords(coords)
------------
**Parameters**

***coords**:  *Number[]|{x:Number,y:Number}*

addCoords(vector)
-----------------
**Parameters**

**vector**:  *Vector2D*,  


setPlayArea(playArea)
---------------------
**Parameters**

**playArea**:  *PlayArea*,  


getCoordArray()
---------------
getCoordObj()
-------------
**Returns**

*{x:Number,y:Number*,  }

setAngle(value)
---------------
**Parameters**

**value**:  *number*,  in radians

calcAngle(value)
----------------
**Parameters**

**value**:  *number*,  in radians

setAngleDegrees(value)
----------------------
**Parameters**

**value**:  *number*,  in degrees

setAbsoluteAngle(value)
-----------------------
**Parameters**

**value**:  *number*,  in radians

calcAbsoluteAngle(value)
------------------------
**Parameters**

**value**:  *number*,  in radians

setAbsoluteAngleDegrees(value)
------------------------------
**Parameters**

**value**:  *number*,  in degrees

getAngle()
----------
**Returns**

*number*,  in radians

clamp(value)
------------
enforces limits on angle


**Parameters**

**value**:  *Number*,  


pointAt(object)
---------------
**Parameters**

**object**:  *Drawable*,  


pointer(object)
---------------
**Parameters**

**object**:  *Drawable*,  


getAbsolutePosition(\[vector\])
-------------------------------
**Parameters**

**[vector]**:  *Vector2D*,  


getAbsoluteRotation(\[vector\])
-------------------------------
**Parameters**

**[vector]**:  *Vector2D*,  


getAbsoluteCoordArray()
-----------------------
getAbsoluteCoordObj()
---------------------
**Returns**

*{x:Number,y:Number*,  }

getAbsoluteAngle()
------------------
**Returns**

*Number*,  in radians

getAbsoluteAngleDegrees()
-------------------------
**Returns**

*Number*,  in degrees

changed()
---------
to be called when you want to notify that something has changed that impacts redraw


