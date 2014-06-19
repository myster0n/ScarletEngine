Vector2D(x, y)
--------------
**Parameters**

**x**:  *Number*,  


**y**:  *Number*,  


setY(value)
-----------
Set y component.


**Parameters**

**value**:  *Number*,  


getY()
------
get y component.


setX(value)
-----------
Set x component.


**Parameters**

**value**:  *Number*,  


getX()
------
get x component.


getCoordArray()
---------------
returns both x and y as an array


getCoordObj()
-------------
returns both x and y as an object


**Returns**

*{x:Number,y:Number}*

cloneVector()
-------------
Creates an exact copy of this Vector2D


**Returns**

*Vector2D*,  A copy of this Vector2D

zeroVector()
------------
Makes x and y zero.


**Returns**

*Vector2D*,  This vector.

isZero()
--------
Is this vector zeroed?


**Returns**

*Boolean*,  Returns true if zeroed, else returns false.

isNormalized()
--------------
Is the vector's length = 1?


**Returns**

*Boolean*,  If length is 1, true, else false.

equals(vector2)
---------------
Does this vector have the same location as another?


**Parameters**

**vector2**:  *Vector2D*,  The vector to test.

**Returns**

Boolean True if equal, false if not.

getLengthSquared()
------------------
Returns the length of this vector, before square root. Allows for a faster check.


getLength()
-----------
Returns the length of the vector.


setLength(value)
----------------
Sets the length which will change x and y, but not the angle.


**Parameters**

**value**:  *Number*,  


getAngle()
----------
**Returns**

*Number*,  angle in radians

getAngleDegrees()
-----------------
**Returns**

*Number*,  angle in degrees

setAngle(value)
---------------
Changes the angle of the vector in radians. X and Y will change, length stays the same.


**Parameters**

**value**:  *Number*,  


setAngleDegrees(value)
----------------------
Changes the angle of the vector in degrees. X and Y will change, length stays the same.


**Parameters**

**value**:  *Number*,  


addAngle(value)
---------------
Add an angle (radians value) to the current angle


**Parameters**

**value**:  *Number*,  


addAngleDegrees(value)
----------------------
Add an angle (degrees value) to the current angle


**Parameters**

**value**:  *Number*,  


normalize()
-----------
Sets the vector's length to 1.


**Returns**

*Vector2D*,  This vector.

normalcate(len)
---------------
Sets the vector's length to len.


**Parameters**

**len**:  *Number*,  The length to set it to.

**Returns**

*Vector2D*,  This vector.

truncate(max)
-------------
Sets the length under the given value. Nothing is done if the vector is already shorter.


**Parameters**

**max**:  *Number*,  The max length this vector can be.

**Returns**

*Vector2D*,  This vector.

reverse()
---------
Makes the vector face the opposite way.


**Returns**

*Vector2D*,  This vector.

dotProduct(vector2)
-------------------
Calculate the dot product of this vector and another.


**Parameters**

**vector2**:  *Vector2D*,  Another vector2D.

**Returns**

*Number*,  The dot product.

crossProduct(vector2)
---------------------
Calculate the cross product of this and another vector.


**Parameters**

**vector2**:  *Vector2D*,  Another Vector2D.

**Returns**

*Number*,  The cross product.

angleBetween(vector1, vector2)
------------------------------
Calculate angle between any two vectors.


**Parameters**

**vector1**:  *Vector2D*,  First vector2d.

**vector2**:  *Vector2D*,  Second vector2d.

**Returns**

*Number*,  Angle between vectors.

getPerpendicular()
------------------
Get the vector that is perpendicular.


**Returns**

*Vector2D*,  The perpendicular vector.

sign(vector2)
-------------
Is the vector to the right or left of this one?


**Parameters**

**vector2**:  *Vector2D*,  The vector to test.

**Returns**

*Boolean*,  If left, returns true, if right, false.

distance(vector2)
-----------------
Calculate distance between two vectors.


**Parameters**

**vector2**:  *Vector2D*,  The vector to find distance.

**Returns**

*Number*,  The distance.

distSQ(vector2)
---------------
Calculate squared distance between vectors. Faster than distance.


**Parameters**

**vector2**:  *Vector2D*,  The other vector.

**Returns**

*Number*,  The squared distance between the vectors.

add(vector2)
------------
Add a vector to this vector.


**Parameters**

**vector2**:  *Vector2D*,  The vector to add to this one.

**Returns**

*Vector2D*,  This vector.

subtract(vector2)
-----------------
Subtract a vector from this one.


**Parameters**

**vector2**:  *Vector2D*,  The vector to subtract.

**Returns**

*Vector2D*,  This vector.

multiply(scalar)
----------------
Multiplies this vector by a scalar.


**Parameters**

**scalar**:  *Number*,  The scalar to multiply by.

**Returns**

*Vector2D*,  This vector, multiplied.

divide(scalar)
--------------
Divides this vector by a scalar.


**Parameters**

**scalar**:  *Number*,  The scalar to multiply by.

**Returns**

*Vector2D*,  This vector, multiplied.

