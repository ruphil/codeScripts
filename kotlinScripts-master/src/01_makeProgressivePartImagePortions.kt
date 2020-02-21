package kotlinScripts

import java.awt.Color.WHITE
import java.awt.image.BufferedImage
import java.io.File
import java.io.FileOutputStream
import java.lang.Integer.max
import javax.imageio.ImageIO

fun portionsMaker() {
    println("Starting PortionsMaker")

    // Required Variables   --------------------------------------------------------------
    val inputImg = "res/birthday.jpg"
    val doodleHand = "res/doodleHand.png"
    val outputDir = "out/01"
    var percentStepInPercent = 1
    var precisionMultiplier = 10000
    // Required Variables   --------------------------------------------------------------

    var percentStep = (percentStepInPercent * precisionMultiplier).toInt()
    var totalPercent = (100 * precisionMultiplier).toInt()

    var imgOutputDir = "$outputDir/$percentStepInPercent-percent"
    (File(imgOutputDir)).mkdirs()

    val doodleImg = ImageIO.read(File(doodleHand))
    val doodleWidth = doodleImg.width
    val doodleHeight = doodleImg.height

    val img = ImageIO.read(File(inputImg))
    val width = img.width
    val height = img.height
    val totalPixels = width * height
    val maxIndex = max(width, height)

    var fileCounter = 1
    for (percentToCompleteLoop in percentStep until (totalPercent + percentStep) step percentStep) {
        val newImg = BufferedImage(width, height, BufferedImage.TYPE_INT_RGB)

        var percentToComplete = percentToCompleteLoop.toDouble() / precisionMultiplier
        val graphics = newImg.createGraphics()
        graphics.background = WHITE
        graphics.clearRect(0, 0, width, height)
        graphics.dispose()

        var pixelsCounter = 0
        val fileName = fileCounter.toString().padStart(5, '0')
        val fileOut = FileOutputStream("$imgOutputDir/img-$fileName.jpg")
        fileCounter++

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

                var completedPercent = pixelsCounter.toFloat() * 100 / totalPixels
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

        ImageIO.write(newImg, "jpg", fileOut)
        if(percentToComplete % 10 == 0.0)
        println("$percentToComplete % Image Part Completed")
    }
}
