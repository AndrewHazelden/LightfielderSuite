#target photoshop

/*
Lightfielder - Load Imagery Into Layer - v1 2019-10-19
By Andrew Hazelden
Email: andrew@andrewhazelden.com
Web: http://www.andrewhazelden.com
*/

// Show an alert dialog and write the same message to the console
function WriteAlert(msg){
	// Write the result in the ExtendScript Toolkit "Javascript Console"
	$.writeln(msg);
	
	// Alternative way to write the result in the console 
	// (This option should be disabled in Photoshop 2019 on macOS)
	// log.writeln(msg);
	
	// Show and alert dialog
	alert(msg);
}

// Check if this script is running on a macOS or Windows OS
function CheckOS() {
	if($.os.search(/macintosh/i) != -1){
		return 'macOS';
	} else {
		return 'Windows';
	}
}

// Get the "$.filename" filepath for the current JSX script
var jsxScriptPath = app.activeScript;

// Build the path to the 'Load Files into Stack.jsx' script
var psScriptPath = ''
if(CheckOS() == 'Windows'){
	// The script is running on Windows
	psScriptPath = Folder.appPackage + '/Presets/Scripts/Load Files into Stack.jsx'
}else{
	// The script is running on MacOS
	psScriptPath = Folder.appPackage + '/../Presets/Scripts/Load Files into Stack.jsx'

	// Example: Folder.appPackage =  /Applications/Adobe%20Photoshop%20CC%202019/Adobe%20Photoshop%20CC%202019.app
}

// Write the result in the ExtendScript Toolkit "Javascript Console"
// WriteAlert('[Launch JSX ' + psScriptPath);

// Run the "Load Files into Stack.jsx" script
$.evalFile(psScriptPath); 
