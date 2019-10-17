#target photoshop

/*
Lightfielder - Send to Looking Glass Display - v0.3 2019-02-05
By Andrew Hazelden
Email: andrew@andrewhazelden.com
Web: http://www.andrewhazelden.com

## Overview ##

This script will push the current image to the Quiltr Viewer. This will result in the multi-view lightfield image being shown on the Looking Glass Display


## Install ##

Step 1. Install the Adobe CC "ExtendScript Toolkit" app. (To do this you need to open the Creative Cloud utility. Show the preferences window and switch to the "Creative Cloud" tab. Enable the "Show Older Apps" checkbox. At this point the "ExtendScript Toolkit" application will be listed as a downloadable option in the Creative Cloud "Apps" tab.)

Step 2. Copy the "Lightfielder - Send to Looking Glass Display.jsx" script into the Photoshop "Presets > Scripts" folder.

Step 3. Restart Photoshop and open an image.

Step 4. Run this script using the "File > Scripts > Lightfielder - Send to Looking Glass Display" menu.

Step 5. You may need to adjust the "videoAdapter" variable in this script to have a different monitor # so the footage is correctly pushed to the display.


## Todo ###

Add a file exists check to see that the Quiltr Viewer executable is present on disk at:
C:\Program Files (x86)\Quiltr\QUILTR_VIEWER.exe

*/

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
	
	// Should debugging info be shown
	var debugMode = '-debug';
	
	// Monitor number #
	var videoAdapter = 1;
	// var videoAdapter = 2;
	
	// Playback mode 'single', 'flipbook'
	var playbackMode = 'single';
	// var playbackMode = 'flipbook';
	
	// Options
	var options = debugMode + ' -adapter ' + videoAdapter + ' -function ' + playbackMode + ' ';
	
	// Run a system shell process
	WriteAlert('[Lightfielder][Send to Looking Glass Display] - Image\n' + imagePath);
	var result = '';
	var executable = '';
	var command = '';
	
	if(CheckOS() == 'Windows'){
		// QUILTR only exists for Windows as of 2019-02-05
		executable = "C:\\Program Files (x86)\\Quiltr\\QUILTR_VIEWER.exe";
		
		// Add the extra options
		command = 'start "" "' + executable + '" ' + options + ' "' + imagePath + '" ';
		
		// Skip adding the extra options
		// command = 'start "" "' + executable + '"' + ' "' + imagePath + '" ';
		
		result = app.system(command);
		WriteAlert('[Launch Command] ' + command);
		WriteAlert('[Result] ' + result);
	}else{
		// This script will not run on macOS
		alert('[Lightfielder][Send to Looking Glass Display] - Warning\nThe Looking Glass QUILTR_VIEWER tool is not available for macOS.');
	}
}else{
	// Display the results
	WriteAlert("Lightfielder][Send to Looking Glass Display] - Warning\nPlease open an image before running this script.")
}
