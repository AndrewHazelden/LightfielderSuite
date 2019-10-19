#target photoshop

/*
Lightfielder - Send to Quiltr - v1 2019-10-19
By Andrew Hazelden
Email: andrew@andrewhazelden.com
Web: http://www.andrewhazelden.com

## Overview ##

This script will open the Quiltr CLI.

## Install ##

Step 1. Install the Adobe CC "ExtendScript Toolkit" app. (To do this you need to open the Creative Cloud utility. Show the preferences window and switch to the "Creative Cloud" tab. Enable the "Show Older Apps" checkbox. At this point the "ExtendScript Toolkit" application will be listed as a downloadable option in the Creative Cloud "Apps" tab.)

Step 2. Copy the "Lightfielder - Send to Quiltr.jsx" script into the Photoshop "Presets > Scripts" folder.

Step 3. Restart Photoshop and open an image.

Step 4. Run this script using the "File > Scripts > Lightfielder - Send to Quiltr" menu.


## Todo ###

Add a file exists check to see that the Quiltr executable is present on disk at:
C:\Program Files (x86)\Quiltr\QUILTR.exe

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


// Run a system shell process
var result = '';
var executable = '';
var command = '';

if(CheckOS() == 'Windows'){
	// QUILTR only exists for Windows as of 2019-02-05
	executable = "C:\\Program Files (x86)\\Quiltr\\QUILTR.exe";
	
	// Add the extra options
	command = 'start "" "' + executable + '" ';
	
	result = app.system(command);
	WriteAlert('[Launch Command] ' + command);
	WriteAlert('[Result] ' + result);
}else{
	// This script will not run on macOS
	alert('[Lightfielder][Send to Quiltr] - Warning\nThe Looking Glass QUILTR tool is not available for macOS.');
}
