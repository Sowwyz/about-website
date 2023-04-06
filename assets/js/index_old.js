var canvas = document.getElementById("canvas"); // Get the canvas element 
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

/******* Add the create scene function ******/
var createScene = function () {

  // Create the scene space
  var scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(1, 1, 1);

  // Add a camera to the scene and attach it to the canvas
  var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,5), scene);
  camera.attachControl(canvas, true);

  // Remove all inputs to the camera
  var inputManager = camera.inputs;
  inputManager.clear();
  
  var lastPosition = new BABYLON.Vector3(0.5, 0.5, 0); 
  
  var handlePosition = ()=>{
    var xPos = (event.pageX - window.innerWidth/2) / window.innerWidth;
    var yPos = (event.pageY - window.innerHeight/2) / window.innerHeight;
    var curentPosition = new BABYLON.Vector3(xPos, yPos, 0);
    console.log("currpos: " + curentPosition);
    console.log("lastpos: " + lastPosition);
    
    var currentToLast = curentPosition.subtract(lastPosition);
    console.log("currentToLast: " + currentToLast);

    var deltaZ = currentToLast.x;
    var deltaX = 0 * currentToLast.y;

    var cameraPosition = camera.position;
    console.log("cameraPosition: "+ cameraPosition);
    camera.setPosition(new BABYLON.Vector3(cameraPosition.x + deltaX, cameraPosition.y, cameraPosition.z + deltaZ));
  }
  
  window.addEventListener("pointermove", function (event) {
    handlePosition();
    var xPos = (event.pageX - window.innerWidth/2) / window.innerWidth;
    var yPos = (event.pageY - window.innerHeight/2) / window.innerHeight;
    lastPosition = new BABYLON.Vector3(xPos, yPos, 0);
  });
  
  // Add lights to the scene
  var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
  var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

  // Add and manipulate meshes in the scene
  var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:2}, scene);

  return scene;
};
/******* End of the create scene function ******/    

var scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () { 
  scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () { 
  engine.resize();
});