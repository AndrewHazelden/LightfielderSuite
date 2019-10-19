#target photoshop

/*
Lightfielder - Set Metadata - v1 2019-10-19
By Andrew Hazelden
Email: andrew@andrewhazelden.com
Web: http://www.andrewhazelden.com

## Overview ##

This script will force Looking Glass style "quilted" metadata into an multi-view tiled texture atlas image. This allows the footage to be displayed on a volumetric display.

## Install ##

Step 1. Install the Adobe CC "ExtendScript Toolkit" app. (To do this you need to open the Creative Cloud utility. Show the preferences window and switch to the "Creative Cloud" tab. Enable the "Show Older Apps" checkbox. At this point the "ExtendScript Toolkit" application will be listed as a downloadable option in the Creative Cloud "Apps" tab.)

Step 2. Copy the "Lightfielder - Set Metadata.jsx" script into the Photoshop "Presets > Scripts" folder.

Step 3. Restart Photoshop and open an image.

Step 4. Run this script using the "File > Scripts > Lightfielder - Set Metadata" menu.

Todo:

Switch to a nodeJS based HTML panel

Quiltr Metadata Example:
<lkg><properties vX="5" vY="9" pixelAspect="" fps=""/><info renderer=""/></lkg>

*/

// -----------------------------------------
// Quilting Variables
// -----------------------------------------

// Creator/Tool name
var renderer = 'LightfielderSuite';

// Number of horizontal (X) axis tiles
var xViews = 5;

// Number of vertical (Y) axis tiles
var yViews = 9;

// Pixel aspect ratio
var pixelAspect = 1;
// var pixelAspect = 1.3;
// var pixelAspect = 1.6;

// Should a custom pixel aspect ratio be defined
var forceCustomPixelAspectRatio = false;

// Image sequence playback rate
var fps = 30;

// Is this a multi-frame image sequence
var isSequence = false;

// -----------------------------------------

// Bring the Photoshop application window to the foreground
// app.bringToFront();

// Get the ""$.filename" filepath for the current JSX script
var jsxScriptPath = app.activeScript;

// Get the operating system name
// Example: "Macintosh OS 10.14.1/64)"
var os = $.os;

// Show an alert dialog and write the same message to the console
function WriteAlert(msg){
	// Write the result in the ExtendScript Toolkit "Javascript Console"
	$.writeln(msg);
	
	// Alternative way to write the result in the console 
	// (This option should be disabled in Photoshop 2019 on macOS)
	// log.writeln(msg);
	
	// Show and alert dialog
	// alert(msg);
}

// Check if this script is running on a macOS or Windows OS
function CheckOS() {
	if($.os.search(/macintosh/i) != -1){
		return 'macOS';
	} else {
		return 'Windows';
	}
}

if (app.documents.length > 0){
	// Get the absolute filepath (Adding .fsName removes the %20 spaces)
	var imagePath = app.activeDocument.fullName.fsName;
	
	// Get the filename for the current image: "imagename.ext"
	var imageFilename = app.activeDocument.name;
	
	// Get the containing folder name for the current image
	var imageDir = app.activeDocument.path;
	
	// Get the image width and height
	var width = app.activeDocument.width.value;
	var height = app.activeDocument.height.value;
	
	// Get the layers
	var layer = app.activeDocument.layers[0];
	
	// Close the open document so it's not write locked
	app.activeDocument.close()
	
	// Quiltr Imagemagick executable path
	//var executable = '"' + 'C:\\Program Files (x86)\\Quiltr\\magick.exe' + '" ' + 'convert' + ' ';
	
	// Photoshop Imagemagick executable path
	var executable = '"' + Folder.appPackage.fsName + '\\convert.exe' + '"' + ' ';

	// Exiftool executable path
	//var executable = '"' + 'C:\\Program Files\\LightfielderSuite\\Bin\\win\\panotoolsNG\\bin\\exiftool' + '" ';
	
	// Exiftool CLI options
	// var options = ' ' + '-overwrite_original';
	var options = ' ';
	
	// The metadata tags are written into the comments record
	var comment = ''
	
	// Imagemagick comment CLI option
	comment = ' ' + '-set comment' + ' '
	
	// Exiftool comment CLI option
	//comment = ' ' + '-Comment='
	
	// Start the comment string
	comment += '"<lkg><properties vX=\\"' + xViews+ '\\" vY=\\"' + yViews + '\\"';

	// Should a custom pixel aspect ratio be defined
	if(forceCustomPixelAspectRatio == true){
		// Pixel aspect ratio
		comment += ' ' + 'pixelAspect=\\"' + pixelAspect + '\\"';
	}else{
		comment += ' ' + 'pixelAspect=\\"\\"';
	}
	
	// Is this a multi-frame image sequence
	if(isSequence == true){
		// Image sequence playback rate
		comment += ' ' + 'fps=\\"' + fps + '\\"';
	}else{
		comment += ' ' + 'fps=\\"\\"';
	}
	
	// Close the properties tag
	comment += '/>';
	
	// Add the Creator/Tool name metadata
	comment += ' ' + '<info renderer=\\"' + renderer + '\\"/></lkg>"';
	
	
	
	// Run a system shell process
	WriteAlert('[Lightfielder][Set Metadata] - Image\n' + imagePath);
	
	var result = '';
	var command = '';
	if(CheckOS() == 'Windows'){
		// Quiltr CLI
		var command = 'start "" ' + executable + ' "' + imagePath + '" ' + options + comment + ' "' + imagePath + '" ';
		// var command = '"' + executable + '" ' + ' "' + imagePath + '" ' + options + comment + ' "' + imagePath + '" ';
		
		// Exiftool CLI
		// var command = 'start "" ' + executable + ' ' + options + comment + ' "' + imagePath + '" ';
		result = app.system(command);
		
		WriteAlert('[Launch Command] ' + command);
		WriteAlert('[Result] ' + result);
		
		// Display the results
		// alert('[Lightfielder][Set Metadata] - Image\n' + imagePath + '\nResult\n' + result + '\nOS\n' + os)
		alert('[Lightfielder][Set Metadata] - Image\n' + imagePath + '\nResult\n' + result)
	}else{
		// This script will not run on macOS
		alert('[Lightfielder][Set Metadata] - Warning\nmacOS metadata editing support is a work-in-progress.');
	}
}else{
	// Display the results
	alert('[Lightfielder][Set Metadata] - Warning\nPlease open an image before running this script.')
}
