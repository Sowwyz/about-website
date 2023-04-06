/** 
 * Script importation dynamic terrain
 * This section will pull from babylon JS CDN and add dynamic terrain
 */
var url = "https://cdn.rawgit.com/BabylonJS/Extensions/master/DynamicTerrain/dist/babylon.dynamicTerrain.min.js";
var s = document.createElement("script");
s.src = url;
document.head.appendChild(s);



/** 
 * Creating default scene on the canvas using babylon.js engine
 */
var canvas = document.getElementById("canvas"); // Get the canvas element 
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

var createScene = function() {
  
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(1, 1, 1);
  
    return scene;
}

var scene = createScene(); //Call the createScene function

// Add Light To The Scene
var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0.0, 1.0, 0.0), scene);
light.intensity = 0.75;
light.specular = BABYLON.Color3.Black();

// Create Camera
var camera = new BABYLON.FlyCamera("Camera", new BABYLON.Vector3(0, 10, -10), scene);
camera.rotation = new BABYLON.Vector3(0.1, 0, 0);
camera.attachControl(canvas, true);

// Remove all inputs to the camera
var inputManager = camera.inputs;
inputManager.clear();



/** 
 * Mouse location tracker for real-time visual effects
 */
var lastPosition = new BABYLON.Vector3(0.5, 0.5, 0); 

var handlePosition = function() { 
  var xPos = (event.pageX - window.innerWidth/2) / window.innerWidth;
  var yPos = (event.pageY - window.innerHeight/2) / window.innerHeight;
  var curentPosition = new BABYLON.Vector3(xPos, yPos, 0);
  //console.log("currpos: " + curentPosition);
  //console.log("lastpos: " + lastPosition);

  var currentToLast = curentPosition.subtract(lastPosition);
  //console.log("currentToLast: " + currentToLast);

  var deltaZ = currentToLast.x;
  var deltaX = 0 * currentToLast.y;

  var cameraPosition = camera.position;
  //console.log("cameraPosition: "+ cameraPosition);
  //camera.setPosition(new BABYLON.Vector3(cameraPosition.x + deltaX, cameraPosition.y, cameraPosition.z + deltaZ));
}

var isWire = true;

window.addEventListener("pointermove", function (event) {
  handlePosition();
  var xPos = (event.pageX - window.innerWidth/2) / window.innerWidth;
  var yPos = (event.pageY - window.innerHeight/2) / window.innerHeight;
  lastPosition = new BABYLON.Vector3(xPos, yPos, 0);
  if (xPos < 0) { 
    isWire = false;
  }
  else {
    isWire = true;
  }
  console.log(isWire);
});


/** 
 * Standard animation for permanent scrolling across the terrain
 */
var startAnimation = function() {
    // Enable Animation
    var frameRate = 20;
    
    var movein = new BABYLON.Animation("movein", "position", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
	
	var movein_keys = []; 

    movein_keys.push({
        frame: 0,
        value: new BABYLON.Vector3(0, 10, 0)
    });

    movein_keys.push({
        frame: 3 * frameRate,
        value: new BABYLON.Vector3(0, 10, 40)
    });

    movein.setKeys(movein_keys);
  
    scene.beginDirectAnimation(camera, [movein], 0, 25 * frameRate, true);
}

/** 
 * Temporary axis for better visibility of directions
 */
var showAxis = function(size) {
var makeTextPlane = function(text, color, size) {
var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
dynamicTexture.hasAlpha = true;
dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
plane.material.backFaceCulling = false;
plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
plane.material.diffuseTexture = dynamicTexture;
return plane;
    };

var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
    new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
    new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
    ], scene);
axisX.color = new BABYLON.Color3(1, 0, 0);
var xChar = makeTextPlane("X", "red", size / 10);
xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
var axisY = BABYLON.Mesh.CreateLines("axisY", [
    new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
    new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
    ], scene);
axisY.color = new BABYLON.Color3(0, 1, 0);
var yChar = makeTextPlane("Y", "green", size / 10);
yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
    new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
    new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
    ], scene);
axisZ.color = new BABYLON.Color3(0, 0, 1);
var zChar = makeTextPlane("Z", "blue", size / 10);
zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};

//showAxis(100);


/** 
 * Map data creation
 * The map is a flat array of successive 3D coordinates (x, y, z).
 * It's defined by a number of points on its width : mapSubX
 * and a number of points on its height : mapSubZ
 */
var mapSubX = 100;             // point number on X axis
var mapSubZ = 1000;              // point number on Z axis
var seed = 0.3;                 // seed
var noiseScale = 0.06;         // noise frequency
var elevationScale = 14.0;
noise.seed(seed);
var mapData = new Float32Array(mapSubX * mapSubZ * 3); // 3 float values per point : x, y and z

var paths = [];                             // array for the ribbon model
for (var l = 0; l < mapSubZ; l++) {
    var path = [];                          // only for the ribbon
    for (var w = 0; w < mapSubX; w++) {
        var x = (w - mapSubX * 0.5) * 2.0;
        var z = (l - mapSubZ * 0.5) * 2.0;
        var y = noise.simplex2(x * noiseScale, z * noiseScale);
        if (Math.abs(x) > 6) {
            y *= (0.5 + y) * y * elevationScale;   // let's increase a bit the noise computed altitude
        }
        else {
            y *= (0.5 + y) * y * (elevationScale / (7 - Math.abs(x)));
        }
               
        mapData[3 *(l * mapSubX + w)] = x;
        mapData[3 * (l * mapSubX + w) + 1] = y;
        mapData[3 * (l * mapSubX + w) + 2] = z;
        
        path.push(new BABYLON.Vector3(x, y, z));
    }
    paths.push(path);
}

/**
var map = BABYLON.MeshBuilder.CreateRibbon("m", {pathArray: paths, sideOrientation: 2}, scene);
map.position.y = -1.0;
var mapMaterial = new BABYLON.StandardMaterial("mm", scene);
mapMaterial.wireframe = true;
mapMaterial.alpha = 0.5;
map.material = mapMaterial;
*/

// wait for dynamic terrain extension to be loaded
s.onload = function() {

    // Dynamic Terrain
    // ===============
    var terrainSub = 200;               // 100 terrain subdivisions

    var params = {
        mapData: mapData,               // data map declaration : what data to use ?
        mapSubX: mapSubX,               // how are these data stored by rows and columns
        mapSubZ: mapSubZ,
        terrainSub: terrainSub          // how many terrain subdivisions wanted
    }
    
    var terrain = new BABYLON.DynamicTerrain("t", params, scene);

    var terrainMat1 = new BABYLON.CustomMaterial("tm", scene);
    terrainMat1.diffuseColor = BABYLON.Color3.White();
    terrainMat1.wireframe = false;
    terrainMat1.alpha = 0.2;
  
    var terrainMat2 = new BABYLON.StandardMaterial("tm", scene);
    terrainMat2.diffuseColor = BABYLON.Color3.Black();
    terrainMat2.wireframe = true;
    terrainMat2.alpha = 0.3;
  
    var terrainMat = new BABYLON.MultiMaterial("multi", scene);
    terrainMat.subMaterials.push(terrainMat1);
    terrainMat.subMaterials.push(terrainMat2);
  
    //terrainMaterial.alpha = 0.8;
    terrain.mesh.material = terrainMat;
    var verticesCount = terrain.mesh.getTotalVertices();
    var indicesCount = terrain.mesh.getTotalIndices();

    terrain.mesh.subMeshes = [];

    //terrain.mesh.subMeshes.push(new BABYLON.SubMesh(0, 1, verticesCount, 120000, 20000, terrain.mesh));
    terrain.mesh.subMeshes.push(new BABYLON.SubMesh(1, 0, verticesCount, 120000, 20000, terrain.mesh));
}   // onload closing bracket



/**
 * PostProcessing used for visual RGB effects on hover on a link
 * Credit to https://www.shadertoy.com/view/4t23Rc under MIT License
 */
var rgbGlitchFX = 
`varying vec2 vUV;
uniform sampler2D textureSampler;
uniform vec2 screenSize;

uniform sampler2D noiseRef0;
uniform sampler2D noiseRef1;

uniform float time; 

#define AMPLITUDE 0.05
#define SPEED 10.0

vec4 rgbShift( in vec2 p , in vec4 shift) {
    shift *= 2.0*shift.w - 1.0;
    vec2 rs = vec2(shift.x,-shift.y);
    vec2 gs = vec2(shift.y,-shift.z);
    vec2 bs = vec2(shift.z,-shift.x);    
    float r = texture2D(textureSampler, p+rs, 0.0).x;
    float g = texture2D(textureSampler, p+gs, 0.0).y;
    float b = texture2D(textureSampler, p+bs, 0.0).z;
    return vec4(r,g,b,1.0);
}
vec4 noise( in vec2 p ) {
    return texture2D(noiseRef0, p, 0.0);
}

vec4 vec4pow( in vec4 v, in float p ) {
    return vec4(pow(v.x,p),pow(v.y,p),pow(v.z,p),v.w); 
}
void main(void){ 
    vec2 p = vUV;
    vec4 c = vec4(0.0,0.0,0.0,1.0);
    vec4 shift = vec4pow(noise(vec2(SPEED*time,2.0*SPEED*time/25.0 )),8.0)
        		*vec4(AMPLITUDE,AMPLITUDE,AMPLITUDE,1.0);
    c += rgbShift(p, shift);
   gl_FragColor = c;
}
`;

BABYLON.Effect.ShadersStore['rgbGlitchEffectFragmentShader'] = rgbGlitchFX;

var time = 0;
var rate = 0.01;

scene.registerBeforeRender(function () {
    time+=scene.getAnimationRatio()*rate;
});

var postProcess = new BABYLON.PostProcess("rgbGlitchEffect", "rgbGlitchEffect", ["time", "screenSize"], ["noiseRef0", "noiseRef1"], 1, camera);
scene.postProcessesEnabled = false;
var noiseTexture0 = new BABYLON.Texture('./assets/textures/grass.jpg', scene);
var noiseTexture1 = new BABYLON.Texture('./assets/textures/ground.jpg', scene);

postProcess.onApply = function (effect) {
    effect.setVector2("screenSize", new BABYLON.Vector2(postProcess.width, postProcess.height));
    effect.setFloat('time', time); //this is the problematic line
    effect.setTexture('noiseRef0', noiseTexture0);
    effect.setTexture('noiseRef1', noiseTexture1);
};  

var postProcess = function() { 
    if (scene.postProcessesEnabled == false) {
        scene.postProcessesEnabled = true;

        setTimeout(function(){ 
            scene.postProcessesEnabled = false;
        }, 300);
    }
}


/**
 * Necessary loops for proper rendering
 */

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () { 
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () { 
    engine.resize();
});