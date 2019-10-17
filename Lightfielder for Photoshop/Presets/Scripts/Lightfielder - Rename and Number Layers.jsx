#target photoshop

/*
Lightfielder - Rename and Number Layers - v0.3 2019-02-05
By Andrew Hazelden
Email: andrew@andrewhazelden.com
Web: http://www.andrewhazelden.com
*/

// Automatically number the Photoshop layers so each layer is called "Layer #".
var LayerCount = app.activeDocument.layers.length;  
for(var lyr = 0; lyr < LayerCount;lyr++){    
	app.activeDocument.artLayers[lyr].name = 'Layer ' + (lyr + 1);  
}
