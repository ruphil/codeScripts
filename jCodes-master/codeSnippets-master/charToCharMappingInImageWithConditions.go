package main

import (
    "fmt"
    "image"
    _ "image/png"
    "os"
)

func main() {
    // myImage := image.NewRGBA(image.Rect(0, 0, 2, 2))

    // myImage.Pix[0] = 255 // 1st pixel red
    // myImage.Pix[1] = 0 // 1st pixel green
    // myImage.Pix[2] = 0 // 1st pixel blue
    // myImage.Pix[3] = 255 // 1st pixel alpha
    // myImage.Pix[14] = 255
    // myImage.Pix[15] = 255

    // outputFile, err := os.Create("test.png")
    
    // if err != nil {
    // 	// Handle error
    // }
    // defer outputFile.Close()

    // png.Encode(outputFile, myImage)

    // existingImageFile, err := os.Open("test.png")
    existingImageFile, err := os.Open("chars.png")
	if err != nil {
		// Handle error
	}
	defer existingImageFile.Close()

	// Calling the generic image.Decode() will tell give us the data
	// and type of image it is as a string. We expect "png"
	imageData, imageType, err := image.Decode(existingImageFile)
	if err != nil {
		// Handle error
	}
	fmt.Println(imageData)
	fmt.Println(imageType)
}
