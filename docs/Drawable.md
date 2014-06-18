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


checkDetailedCollisionWith(object)
----------------------------------
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


setParent(parent)
-----------------
**Parameters**

**parent**:  *Drawable | PlayArea*,  


setPlayArea(playArea)
---------------------
**Parameters**

**playArea**:  *PlayArea*,  


getCoordArray()
---------------
getCoordObj()
-------------
setAngle(value)
---------------
**Parameters**

**value**,  


calcAngle(value)
----------------
**Parameters**

**value**,  


setAngleDegrees(value)
----------------------
**Parameters**

**value**,  


calcAbsoluteAngle(value)
------------------------
**Parameters**

**value**:  *Number*,  


clamp(value)
------------
enforces limits on angle


**Parameters**

**value**:  *Number*,  


