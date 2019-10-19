#target photoshop

/*
Lightfielder - Send to DJV View - v1 2019-10-19
By Andrew Hazelden
Email: andrew@andrewhazelden.com
Web: http://www.andrewhazelden.com

## Overview ##

This script will push the current Photoshop image to DJV View


## Install ##

Step 1. Install the Adobe CC "ExtendScript Toolkit" app. (To do this you need to open the Creative Cloud utility. Show the preferences window and switch to the "Creative Cloud" tab. Enable the "Show Older Apps" checkbox. At this point the "ExtendScript Toolkit" application will be listed as a downloadable option in the Creative Cloud "Apps" tab.)

Step 2. Copy the "Lightfielder - Send to DJV View.jsx" script into the Photoshop "Presets > Scripts" folder.

Step 3. Restart Photoshop and open an image.

Step 4. Run this script using the "File > Scripts > Lightfielder - Send to DJV View" menu.


## Todo ###

Add a file exists check to see that the DJV executable is present on disk.

*/


// -----------------------------------------

// Bring the Photoshop application window to the foreground
// app.bringToFront();

// Get the "$.filename" filepath for the current JSX script
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
	
	// Run a system shell process
	WriteAlert('[Lightfielder Send to DJV View] - Image\n' + imagePath);
	
	// DJV View executable path
	var executable = '';
	if(CheckOS() == 'Windows'){
		// LFS Provided DJV View
		executable = '"C:\\Program Files\\LightfielderSuite\\Bin\\win\\djv\\bin\\djv_view.exe" ';
		
		// User Provided DJV View
		// executable = '"C:\\Program Files\\DJV\\bin\\djv_view.exe" ';
		// executable = '"C:\\Program Files\\DJV-1.2.5-win64\\bin\\djv_view.exe" ';
	}else{
		// LFS Provided DJV View
		executable = 'open -a "/Applications/LightfielderSuite/Bin/mac/djv/DJV.app" --args ';
		
		// User Provided DJV View
		// executable = 'open -a "/Applications/DJV.app/Contents/Resources/bin/djv_view.sh" --args';
	}
	
	// Run a system shell process
	var result = '';
	var command = executable + ' "' + imagePath + '" ' + "&";
	result = app.system(command);
	WriteAlert('[Launch Command] ' + command);
	WriteAlert('[Result] ' + result);
}else{
	// Display the results
	WriteAlert('[Lightfielder][Send to DJV View] - Warning\nPlease open an image before running this script.');
}
