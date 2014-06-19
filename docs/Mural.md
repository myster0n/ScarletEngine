Mural(selector, \[smooth\], \[immediate\])
------------------------------------------
**Parameters**

**selector**:  *String*,  CSS selector for your canvas element

**[smooth]**:  *boolean*,  turn on image smoothing (default off)

**[immediate]**:  *boolean*,  if true, redraw the image when receiving a change, otherwise wait until redraw is called (default false)

hidePointer()
-------------
hide mouse pointer


showPointer()
-------------
show mouse pointer


getMousePosition()
------------------
**Returns**

*{x: number, y: number*,  } mouse coordinates relative to mural

addPlayArea(x, y, width, height)
--------------------------------
**Parameters**

**x**:  *Number*,  


**y**:  *Number*,  


**width**:  *Number*,  


**height**:  *Number*,  


changed()
---------
gets called by children to notify that there has been a visual change


redraw(\[force\])
-----------------
redraw the canvas element if something has changed or if force = true


**Parameters**

**[force]**:  *boolean*,  


draw(\[force\])
---------------
make playAreas redraw themselves if changed or if force = true


**Parameters**

**[force]**:  *boolean*,  


animate(object)
---------------
add sprite to list of sprites that has to be animated automatically


**Parameters**

**object**:  *Sprite*,  


removeAnimation(object)
-----------------------
remove sprite to list of sprites that has to be animated automatically


**Parameters**

**object**:  *Sprite*,  


