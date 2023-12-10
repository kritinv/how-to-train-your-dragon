/** A collidable tree in the game positioned at X, Y, Z in the scene and with
* scale S.
*/
function Tree(x, y, z, s) {

  // Explicit binding.
  var self = this;

  // The object portrayed in the scene.
  this.mesh = new THREE.Object3D();
  var top = createCylinder(1, 300, 300, 4, Colors.green, 0, 1000, 0);
  var mid = createCylinder(1, 400, 400, 4, Colors.green, 0, 800, 0);
  var bottom = createCylinder(1, 500, 500, 4, Colors.green, 0, 500, 0);
  var trunk = createCylinder(100, 100, 250, 32, Colors.brownDark, 0, 125, 0);
  this.mesh.add(top);
  this.mesh.add(mid);
  this.mesh.add(bottom);
  this.mesh.add(trunk);
  this.mesh.position.set(x, y, z);
  this.mesh.scale.set(s, s, s);
  this.scale = s;

  /**
   * A method that detects whether this tree is colliding with the character,
   * which is modelled as a box bounded by the given coordinate space.
   */
  this.collides = function(minX, maxX, minY, maxY, minZ, maxZ) {
      var treeMinX = self.mesh.position.x - this.scale * 250;
      var treeMaxX = self.mesh.position.x + this.scale * 250;
      var treeMinY = self.mesh.position.y;
      var treeMaxY = self.mesh.position.y + this.scale * 1150;
      var treeMinZ = self.mesh.position.z - this.scale * 250;
      var treeMaxZ = self.mesh.position.z + this.scale * 250;
      return treeMinX <= maxX && treeMaxX >= minX
          && treeMinY <= maxY && treeMaxY >= minY
          && treeMinZ <= maxZ && treeMaxZ >= minZ;
  }

}

/** 
*
* UTILITY FUNCTIONS
* 
* Functions that simplify and minimize repeated code.
*
*/

/**
* Utility function for generating current values of sinusoidally
* varying variables.
*
* @param {number} FREQUENCY The number of oscillations per second.
* @param {number} MINIMUM The minimum value of the sinusoid.
* @param {number} MAXIMUM The maximum value of the sinusoid.
* @param {number} PHASE The phase offset in degrees.
* @param {number} TIME The time, in seconds, in the sinusoid's scope.
* @return {number} The value of the sinusoid.
*
*/
function sinusoid(frequency, minimum, maximum, phase, time) {
  var amplitude = 0.5 * (maximum - minimum);
  var angularFrequency = 2 * Math.PI * frequency;
  var phaseRadians = phase * Math.PI / 180;
  var offset = amplitude * Math.sin(
      angularFrequency * time + phaseRadians);
  var average = (minimum + maximum) / 2;
  return average + offset;
}

/**
* Creates an empty group of objects at a specified location.
*
* @param {number} X The x-coordinate of the group.
* @param {number} Y The y-coordinate of the group.
* @param {number} Z The z-coordinate of the group.
* @return {Three.Group} An empty group at the specified coordinates.
*
*/
function createGroup(x, y, z) {
  var group = new THREE.Group();
  group.position.set(x, y, z);
  return group;
}

/**
* Creates and returns a simple box with the specified properties.
*
* @param {number} DX The width of the box.
* @param {number} DY The height of the box.
* @param {number} DZ The depth of the box.
* @param {color} COLOR The color of the box.
* @param {number} X The x-coordinate of the center of the box.
* @param {number} Y The y-coordinate of the center of the box.
* @param {number} Z The z-coordinate of the center of the box.
* @param {boolean} NOTFLATSHADING True iff the flatShading is false.
* @return {THREE.Mesh} A box with the specified properties.
*
*/
function createBox(dx, dy, dz, color, x, y, z, notFlatShading) {
  var geom = new THREE.BoxGeometry(dx, dy, dz);
  var mat = new THREE.MeshPhongMaterial({
      color:color, 
      flatShading: notFlatShading != true
  });
  var box = new THREE.Mesh(geom, mat);
  box.castShadow = true;
  box.receiveShadow = true;
  box.position.set(x, y, z);
  return box;
}

/**
* Creates and returns a (possibly asymmetrical) cyinder with the 
* specified properties.
*
* @param {number} RADIUSTOP The radius of the cylinder at the top.
* @param {number} RADIUSBOTTOM The radius of the cylinder at the bottom.
* @param {number} HEIGHT The height of the cylinder.
* @param {number} RADIALSEGMENTS The number of segmented faces around 
*                                the circumference of the cylinder.
* @param {color} COLOR The color of the cylinder.
* @param {number} X The x-coordinate of the center of the cylinder.
* @param {number} Y The y-coordinate of the center of the cylinder.
* @param {number} Z The z-coordinate of the center of the cylinder.
* @return {THREE.Mesh} A box with the specified properties.
*/
function createCylinder(radiusTop, radiusBottom, height, radialSegments, 
                      color, x, y, z) {
  var geom = new THREE.CylinderGeometry(
      radiusTop, radiusBottom, height, radialSegments);
  var mat = new THREE.MeshPhongMaterial({
      color: color,
      flatShading: true
  });
  var cylinder = new THREE.Mesh(geom, mat);
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;
  cylinder.position.set(x, y, z);
  return cylinder;
}


export default Tree;