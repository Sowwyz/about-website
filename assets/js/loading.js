/*
    <!-- Babylon.js CDN -->
    <script src="https://cdn.babylonjs.com/babylon.js"></script>
    <script src="https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.js"></script>
    <script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
    <script src="https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js"></script>
    <script src="https://cdn.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.min.js"></script>
    <script src="https://cdn.babylonjs.com/gui/babylon.gui.min.js"></script>
    <script src="https://cdn.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js"></script>
    <script src="https://cdn.babylonjs.com/serializers/babylonjs.serializers.min.js"></script>
    
    <!-- P5.js CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/p5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/addons/p5.sound.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/addons/p5.dom.min.js"></script>
*/

var loadbar = new ldBar("#loader");
      
function loadPage() {
    // Pull from CDN
    pullCDN();

    // Check for page successful load
    var loadCheck = setInterval(function() { 
        if (loadbar.value >= 100) {
            clearInterval(loadCheck);
            loadbar.set(100);
            document.getElementById('loader').style.opacity = 0.2;
            document.getElementById("loadedText").style.display = "block";
            document.ontouchstart = function(){showPage();}
            document.onclick = function(){showPage();}
        }
    }, 1000);
}

function showPage() {
    document.getElementById("loading").style.display = "none";
    document.getElementById("canvas").style.opacity = 1;
    document.getElementById("menu").style.display = "block";
    startAnimation();

    // Reset onclick functions to nothing
    document.ontouchstart = function(){}
    document.onclick = function(){}
}

function pullCDN() {
    var loadbar = new ldBar("#loader");
    var url = [
        "https://cdn.babylonjs.com/babylon.js", 
        "https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.js", 
        "https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js",
        "https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js",
        "https://cdn.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.min.js",
        "https://cdn.babylonjs.com/gui/babylon.gui.min.js",
        "https://cdn.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js",
        "https://cdn.babylonjs.com/serializers/babylonjs.serializers.min.js",
        "assets/js/perlinnoise.js",
        "assets/js/createscene.js",
        "assets/js/index.js"
    ];
    var incAmt = 100 / url.length;

    for (var i = 0; i < url.length; i++) {
        var s = document.createElement("script");
        s.onload = function() {
            loadbar.set(loadbar.value + incAmt);
            console.log(loadbar.value);
        };
        s.src = url[i];
        s.async = false;
        document.head.appendChild(s);
    }

    // Successfully loaded
    //loadbar.set(100);
}