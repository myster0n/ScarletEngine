Sprite(image, width, height, centerX, centerY, \[rotationOffset\])
------------------------------------------------------------------
**Parameters**

**image**:  *String*,  


**width**:  *Number*,  


**height**:  *Number*,  


**centerX**:  *Number*,  


**centerY**:  *Number*,  


**[rotationOffset]**:  *Number*,  


setFrame(frame)
---------------
sets the animation frame


**Parameters**

**frame**:  *Number*,  


setSpeed(tickSpeed)
-------------------
sets the animation speed (how many ticks until frame change). Lower is faster


**Parameters**

**tickSpeed**:  *Number*,  


addTicks(ticks)
---------------
this amount of ticks has passed, recalculate which animation frame to show


**Parameters**

**ticks**:  *Number*,  


autoAnim(value)
---------------
set or remove sprite from auto anim list


**Parameters**

**value**:  *boolean*,  


addAnimation(name, frames, \[callback\])
----------------------------------------
**Parameters**

**name**:  *String*,  


**frames**:  *Number[]*,  if one of the numbers is -1, the animation stops there.

**[callback]**:  *Function*,  called either on every loop or when the animation stops

setAnimationCallback(name, callback)
------------------------------------
**Parameters**

**name**:  *String*,  previously named animation

**callback**,  [callback] called either on every loop or when the animation stops

startAnimation(name)
--------------------
Starts animation with predefined name


**Parameters**

**name**:  *String*,  


stopAnimation()
---------------
advanceAnimationFrame()
-----------------------
advance to the next frame in the current animation


