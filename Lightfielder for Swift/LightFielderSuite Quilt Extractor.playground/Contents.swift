/*
LightFielderSuite Quilt Extractor - v1 2019-10-17
By Andrew Hazelden <andrew@andrewhazelden.com>

Overview:
Extract the individual views from a quilted 4x4 (tiled texture atlas) layout into an image sequence that is saved to disk.

Usage:
Run this example "Swift Playground" in Xcode 10.1+.

*/

import Cocoa
import Quartz

extension NSImage {
    // Rotate a CGImage and return an NSImage
    // Example: NSImage(cgImage: CGImg!, size: NSSize.zero).imageRotated(by: 90.0)
    func imageRotated(by degrees: CGFloat) -> NSImage{
        let imageRotator = IKImageView()
        var imageRect = CGRect(x: 0, y: 0, width: self.size.width, height: self.size.height)
        let cgImage = self.cgImage(forProposedRect: &imageRect, context: nil, hints: nil)
        imageRotator.setImage(cgImage, imageProperties: [:])
        imageRotator.rotationAngle = CGFloat(-(degrees / 180) * CGFloat(Double.pi))
        let rotatedCGImage = imageRotator.image().takeUnretainedValue()
        return NSImage(cgImage: rotatedCGImage, size: NSSize.zero)
    }
    // Convert a cgImage to an NSImage
    // Example: NSImage(cgImage: CGImg!, size: NSSize.zero).fromImage()
    func fromImage() -> NSImage{
        let imageView = IKImageView()
        var imageRect = CGRect(x: 0, y: 0, width: self.size.width, height: self.size.height)
        let cgImage = self.cgImage(forProposedRect: &imageRect, context: nil, hints: nil)
        imageView.setImage(cgImage, imageProperties: [:])
        let newCGImage = imageView.image().takeUnretainedValue()
        return NSImage(cgImage: newCGImage, size: NSSize.zero)
    }
}

// Crop a CG Image
// Example: CropCGImage(Image: CGImg, x:0, y:0, width: 1080, height: 1080)
func CropCGImage(Image: CGImage, x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) -> CGImage{
    let cropRect : CGRect = CGRect(x: x, y: y, width: width, height: height)
    let resultImg : CGImage = Image.cropping(to: cropRect)!
    return resultImg
}

// Save a JPG image to disk
// Example: SaveJPG(Image: quiltImage, filenamePrefix: "/Users/Andrew/Desktop/quilt", frame: "0001")
func SaveJPG(Image: NSImage, filenamePrefix: String, frame : String){
    let filepath = String(filenamePrefix) + "." + String(frame) + ".jpg"
    
    var imageRect = CGRect(x: 0, y: 0, width: Image.size.width, height: Image.size.height)
    let cgImg = Image.cgImage(forProposedRect: &imageRect, context: nil, hints: nil)
    let bitmapRep = NSBitmapImageRep(cgImage: cgImg!)
    let jpegData = bitmapRep.representation(using: NSBitmapImageRep.FileType.jpeg, properties: [NSBitmapImageRep.PropertyKey.compressionFactor : 1])!
    do{
        try jpegData.write(to: URL(fileURLWithPath: filepath))
        print("    [Write Image] \(filepath)")
    }catch{
        print("    [Write Image Error] \(filepath)")
    }
}

// Create a new folder
// Example: CreateDir("/Users/Andrew/Desktop/Render")
// ToDo: check out .appendingPathComponent("YourFolder")!
func CreateDir(folderPath: String){
    if (FileManager.default.fileExists(atPath: folderPath) != true){
        do {
            try FileManager.default.createDirectory(atPath: folderPath, withIntermediateDirectories: false, attributes: nil)
            print("[Created Folder] \(folderPath)\n")
        }catch let error as NSError{
            print(error.localizedDescription);
             print("[Folder Creation Error] \(folderPath)\n")
        }
    }else{
        print("[Folder Creation Skipped] \(folderPath)\n")
    }
}

// CLI Info
print("\n\nLightFielderSuite Quilt Extractor v0.22 2019-01-18")
print("Created by Andrew Hazelden <andrew@andrewhazelden.com>")
print("---------------------------------------------------------------------")
print("Extract the individual views from a quilted (tiled texture atlas)\nlayout into an image sequence that is saved to disk.")
print("---------------------------------------------------------------------")
print("\n")

// Desktop folder
let homeFolder = NSHomeDirectory()
let desktopFolder = homeFolder + "/Desktop"
let outputFolder = desktopFolder + "/Renders"

// Create the output folder
CreateDir(folderPath: outputFolder)

// ----------------------------------------------------------------------------------------
// Timeline frame
var frame = "0001"

// 4x4 Quilt frame layout
var xViews = 4
var yViews = 4

// The total number of quilted views in the frame
var totalViews = xViews * yViews

// Track the number of views extracted
var viewCount = 0

// Load an image from the Playground "Resources" folder
var srcImage = NSImage(named:"4x4_quilted_silver_mask_numbered.0001.png")

// Source image size
var srcSize = srcImage!.size
var srcRect : CGRect = CGRect(x:0, y:0, width: srcSize.width, height: srcSize.height)
var srcReference = srcImage!.cgImage(forProposedRect: &srcRect, context: nil, hints: nil)

// ----------------------------------------------------------------------------------------
// Crop the views

// Scan throught the quilted view #'s from 1 to the last view
while viewCount < totalViews {
    //print("View \(viewCount)")
    
    // Calculate the view position
    let viewWidth = Int(srcSize.width)/Int(xViews)
    let viewheight = Int(srcSize.height)/Int(yViews)
    
    // Shift the origin for each of the quilted tiles being extracted
    let viewOriginX = (Int(viewCount) % Int(xViews))
    let viewOriginY = Int(yViews-1) - (Int(viewCount / Int(yViews)))
    
    print("[View] \(viewCount + 1)")
    print("    [Tile] \(viewOriginX + 1)x\(viewOriginY + 1)")
    print("    [X] \(viewOriginX * viewWidth)")
    print("    [Y] \(viewOriginY * viewheight)")
    
    // Grab a cropped view rectangle
    let viewCGImage = CropCGImage(Image: srcReference!, x: CGFloat(viewOriginX * viewWidth), y:CGFloat(viewOriginY * viewheight), width: CGFloat(viewWidth), height: CGFloat(viewheight))

    // Generate an NS Image
    //let quiltImage = NSImage(cgImage: viewCGImage, size: NSSize.zero).imageRotated(by: 0)
    let quiltImage = NSImage(cgImage: viewCGImage, size: NSSize.zero).fromImage()
    
    // Write the image to disk
    SaveJPG(Image: quiltImage, filenamePrefix: outputFolder + "/Layer " + String(viewCount + 1), frame: frame)
    
    // Increment to the next view
    viewCount = viewCount + 1
}

print("[Done]\n")

