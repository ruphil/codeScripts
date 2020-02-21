package kotlinFXProjects.gifCreator

import javafx.application.Platform
import javafx.scene.control.ProgressBar
import java.awt.Color
import java.awt.image.BufferedImage
import java.io.File
import javax.imageio.IIOImage
import javax.imageio.ImageIO
import javax.imageio.ImageTypeSpecifier
import javax.imageio.metadata.IIOMetadata
import javax.imageio.metadata.IIOMetadataNode
import javax.imageio.stream.FileImageOutputStream

fun makeGIF(imgPaths: Array<String>, progressBar: ProgressBar?, timeBetweenFramesMS: Int, loopContinuously: Boolean){
    // Images Progressive Parts Settings   --------------------------------------------------------
    val inputImg = imgPaths[0]
    val doodleHand = imgPaths[1]
    val imgOutputDir = "out/01"
    val percentStepInPercent = 1
    val precisionMultiplier = 10000

    (File(imgOutputDir)).mkdirs()
    val percentStep = percentStepInPercent * precisionMultiplier
    val totalPercent = 100 * precisionMultiplier

    val doodleImg = ImageIO.read(File(doodleHand))
    val doodleWidth = doodleImg.width
    val doodleHeight = doodleImg.height

    val img = ImageIO.read(File(inputImg))
    val width = img.width
    val height = img.height
    val totalPixels = width * height
    val maxIndex = Integer.max(width, height)
    // Images Progressive Parts Settings   --------------------------------------------------------

    // GIF Sequencer Settings   --------------------------------------------------------------
//    val timeBetweenFramesMS = 50
//    val loopContinuously = false

    val writerGIF = ImageIO.getImageWritersBySuffix("gif").next()
    val imageTypeSpecifier = ImageTypeSpecifier.createFromBufferedImageType(BufferedImage.TYPE_INT_ARGB)
    val imageWriteParam = writerGIF.defaultWriteParam
    var imageMetaData = writerGIF.getDefaultImageMetadata(imageTypeSpecifier, imageWriteParam)
    imageMetaData = tweekImageMetaData(imageMetaData, timeBetweenFramesMS, loopContinuously)

    val outputStrm = FileImageOutputStream(File("$imgOutputDir/doodle.gif"))
    writerGIF.output = outputStrm
    writerGIF.prepareWriteSequence(null)
    // GIF Sequencer Settings   --------------------------------------------------------------


    for (percentToCompleteLoop in percentStep until (totalPercent + percentStep) step percentStep) {
        val newImg = BufferedImage(width, height, BufferedImage.TYPE_INT_RGB)

        val percentToComplete = percentToCompleteLoop.toDouble() / precisionMultiplier
        val graphics = newImg.createGraphics()
        graphics.background = Color.WHITE
        graphics.clearRect(0, 0, width, height)
        graphics.dispose()

        var pixelsCounter = 0

        outerLoop@
        for (index in 0 until 2 * maxIndex) {
            for (instance in index downTo 0) {
                val row = instance
                val column = index - instance
//            println("$row $column")
                if (row < height && column < width) {

                    val rgbVar = img.getRGB(column, row)
                    newImg.setRGB(column, row, rgbVar)

                    pixelsCounter++
                }

                val completedPercent = pixelsCounter.toFloat() * 100 / totalPixels


//                println("$completedPercent, $percentToComplete")
                if (completedPercent > percentToComplete) {
                    for (i in 0 until doodleWidth) {
                        for (j in 0 until doodleHeight) {
                            val pixel = doodleImg.getRGB(i, j)
                            val totalRow = row + j - doodleHeight/3
                            val totalColumn = column + i - doodleWidth/3
                            if ((pixel shr 24) != 0x00 && 0 < totalRow && totalRow < height && 0 < totalColumn && totalColumn < width) {
                                newImg.setRGB(totalColumn, totalRow, pixel)
                            }
                        }
                    }
                    break@outerLoop
                }
            }
        }

        writerGIF.writeToSequence(IIOImage(newImg, null, imageMetaData), imageWriteParam)


        Platform.runLater { progressBar?.progress = percentToComplete / 100 }

        if(percentToComplete % 10 == 0.0) {
//            progressBar!!.progress = percentToComplete / 100
            println("$percentToComplete % Image Part Completed")
        }
    }
    outputStrm.close()
}

fun tweekImageMetaData(imageMetaData: IIOMetadata, timeBetweenFramesMS: Int, loopContinuously: Boolean): IIOMetadata {
    val metaFormatName = imageMetaData.nativeMetadataFormatName
    val root = imageMetaData.getAsTree(metaFormatName) as IIOMetadataNode

    val graphicsControlExtensionNode = getNode(root,"GraphicControlExtension")
    graphicsControlExtensionNode.setAttribute("disposalMethod", "none")
    graphicsControlExtensionNode.setAttribute("userInputFlag", "FALSE")
    graphicsControlExtensionNode.setAttribute("transparentColorFlag","FALSE")
    graphicsControlExtensionNode.setAttribute("delayTime", (timeBetweenFramesMS / 10).toString())
    graphicsControlExtensionNode.setAttribute("transparentColorIndex","0")

    val commentsNode = getNode(root, "CommentExtensions")
    commentsNode.setAttribute("CommentExtension", "Created by MAH")

    val appEntensionsNode = getNode(root,"ApplicationExtensions")
    val child = IIOMetadataNode("ApplicationExtension")
    child.setAttribute("applicationID", "NETSCAPE")
    child.setAttribute("authenticationCode", "2.0")
    val loop = if (loopContinuously) 0 else 1
    child.userObject = byteArrayOf(0x1, (loop and 0xFF).toByte(), (loop shr 8 and 0xFF).toByte())
    appEntensionsNode.appendChild(child)
    imageMetaData.setFromTree(metaFormatName, root)
    return imageMetaData
}

fun getNode(rootNode: IIOMetadataNode, nodeName: String): IIOMetadataNode {
    val nNodes = rootNode.length
    for (i in 0 until nNodes) {
        if (rootNode.item(i).nodeName.compareTo(nodeName, ignoreCase = true)
            == 0) {
            return rootNode.item(i) as IIOMetadataNode
        }
    }
    val node = IIOMetadataNode(nodeName)
    rootNode.appendChild(node)
    return node
}