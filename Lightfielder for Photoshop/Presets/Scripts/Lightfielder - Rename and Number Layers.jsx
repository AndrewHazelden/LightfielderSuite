#target photoshop

/*
Lightfielder - Rename and Number Layers - v1 2019-10-19
By Andrew Hazelden
Email: andrew@andrewhazelden.com
Web: http://www.andrewhazelden.com
*/

// Automatically number the Photoshop layers so each layer is called "Layer #".
var LayerCount = app.activeDocument.layers.length;  
for(var lyr = 0; lyr < LayerCount;lyr++){    
	app.activeDocument.artLayers[lyr].name = 'Layer ' + (lyr + 1);  
}
