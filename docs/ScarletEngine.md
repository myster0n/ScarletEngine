isKey(key, \[single\])
----------------------
check key press


**Parameters**

**key**:  *Number*,  keyCode to test

**[single]**:  *boolean*,  if true it will return false if there was no keyup previously. So a switch between continuous and single keystroke

mainLoop(timestamp)
-------------------
The main loop of the engine. This will be called automatically by window.requestAnimationFrame, run your custom gameloop (if present) and updates the canvas
The custom gameloop is provided with an object which has the following properties :
progress : time in ms since game start
moment : amount of ms since last loop
ticks : amount of 'ticks' (60th of a second - an integer) since last loop
totalTicks : amount of 'ticks' (60th of a second - an integer) since game start
isKey : function (see isKey)


**Parameters**

**timestamp**,  


start()
-------
start game loop


stop()
------
stop game loop


