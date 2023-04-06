var openAbout = function() { 
    if (!document.getElementById("info").classList.contains("bounceOut")) {
        postProcess();
        document.getElementById("info").style.display = "block";
        setTimeout(function (){
            document.getElementById("aboutText").style.display = "block";
        }, 500);
    }
}

var openDisco = function() { 
    if (!document.getElementById("info").classList.contains("bounceOut")) {
        postProcess();
        document.getElementById("info").style.display = "block";
        setTimeout(function (){
            document.getElementById("discoText").style.display = "block";
        }, 500);
    }
}

var closeInfo = function() { 
    document.getElementById("info").classList.add('bounceOut');

    // Reduce Opacity of Txt
    document.getElementById("aboutText").style.opacity = 0;
    document.getElementById("discoText").style.opacity = 0;
    
    setTimeout(function (){
        document.getElementById("info").style.display = "none";
        document.getElementById("info").classList.remove("bounceOut");
        
        // Get rid of all text and reset opacity
        document.getElementById("aboutText").style.display = "none";
        document.getElementById("aboutText").style.opacity = 1;
        document.getElementById("discoText").style.display = "none";
        document.getElementById("discoText").style.opacity = 1;
    }, 1000);
}