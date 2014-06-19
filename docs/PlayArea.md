PlayArea(canvas, x, y, smooth, immediate)
-----------------------------------------
**Parameters**

**canvas**,  


**x**,  


**y**,  


**smooth**,  


**immediate**,  


getMousePosition()
------------------
get mouse position relative to this playArea


**Returns**

*{x: number, y: number}*

addChild(child, \[level\])
--------------------------
**Parameters**

**child**:  *Drawable*,  


**[level]**:  *number*,  higher levels get drawn on top of lower levels

removeChild(child)
------------------
**Parameters**

**child**:  *Drawable*,  


setParent(parent)
-----------------
**Parameters**

**parent**:  *Mural*,  


changed()
---------
called by child elements to indicate something visible has changed


draw(\[force\])
---------------
draw all children if something has changed or force = true


**Parameters**

**[force]**:  *boolean*,  


animate(object)
---------------
**Parameters**

**object**:  *Drawable*,  


removeAnimation(object)
-----------------------
**Parameters**

**object**:  *Drawable*,  


