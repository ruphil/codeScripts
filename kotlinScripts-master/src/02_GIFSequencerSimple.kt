package kotlinScripts

import java.awt.image.BufferedImage
import java.io.File
import javax.imageio.IIOImage
import javax.imageio.ImageIO
import javax.imageio.ImageTypeSpecifier
import javax.imageio.metadata.IIOMetadata
import javax.imageio.metadata.IIOMetadataNode
import javax.imageio.stream.FileImageOutputStream
import javax.imageio.stream.ImageOutputStream

fun makeGIFSimple() {
    println("Starting to Make GIF")

    val inputDir = "out/01/1-percent"
    val outputFolder = "out/02"
    val timeBetweenFramesMS = 50
    val loopContinuously = false

    val writerGIF = ImageIO.getImageWritersBySuffix("gif").next()
    val imageTypeSpecifier = ImageTypeSpecifier.createFromBufferedImageType(BufferedImage.TYPE_INT_ARGB)
    val imageWriteParam = writerGIF.defaultWriteParam
    var imageMetaData = writerGIF.getDefaultImageMetadata(imageTypeSpecifier, imageWriteParam)
    imageMetaData = tweekImageMetaData(imageMetaData, timeBetweenFramesMS, loopContinuously)

    (File(outputFolder)).mkdirs()
    val outputStrm = FileImageOutputStream(File("$outputFolder/doodle.gif"))
    writerGIF.output = outputStrm
    writerGIF.prepareWriteSequence(null)

    val fileIterator = File(inputDir).walk().iterator()

    while(fileIterator.hasNext()){
        val fileRFolder = fileIterator.next()
        println(fileRFolder)
        if (fileRFolder.isFile) {
            writerGIF.writeToSequence(IIOImage(ImageIO.read(fileRFolder), null, imageMetaData), imageWriteParam)
        }
    }

    writerGIF.endWriteSequence()
    outputStrm.close()

    println("GIF  Made")
}

fun tweekImageMetaData(imageMetaData: IIOMetadata, timeBetweenFramesMS: Int, loopContinuously: Boolean): IIOMetadata{
    val metaFormatName = imageMetaData.nativeMetadataFormatName
    val root = imageMetaData.getAsTree(metaFormatName) as IIOMetadataNode

    val graphicsControlExtensionNode = getNode(root,"GraphicControlExtension")
    graphicsControlExtensionNode.setAttribute("disposalMethod", "none")
    graphicsControlExtensionNode.setAttribute("userInputFlag", "FALSE")
    graphicsControlExtensionNode.setAttribute("transparentColorFlag","FALSE")
    graphicsControlExtensionNode.setAttribute("delayTime", Integer.toString(timeBetweenFramesMS / 10))
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