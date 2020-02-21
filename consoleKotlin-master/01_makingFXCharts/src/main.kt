package makingCharts

import javafx.application.Application
import javafx.collections.FXCollections
import javafx.embed.swing.SwingFXUtils
import javafx.scene.Group
import javafx.scene.Scene
import javafx.scene.chart.*
import javafx.scene.chart.XYChart.*
import javafx.stage.Stage
import java.io.File
import javax.imageio.ImageIO
import kotlin.system.exitProcess


class MakeCharts : Application() {
    override fun start(stage: Stage) {
//        val chart = getPieChart()
        val chart = getBarChartCORS()

        chart.title = "Imported Fruits"
        chart.scaleX = 4.0
        chart.scaleY = 4.0
        chart.relocate(750.0, 600.0)

        val root = Group()
        val scene = Scene(root, 2000.0, 1600.0)
        (scene.root as Group).children.add(chart)

        val fxImage = scene.snapshot(null)
        val image = SwingFXUtils.fromFXImage(fxImage, null)
        val file = File("out/chart.png")
        ImageIO.write(image, "png", file)
        exitProcess(0)

    }

    companion object{
        @JvmStatic
        fun main(args: Array<String>){
            launch(MakeCharts::class.java)
        }
    }

    private fun getPieChart(): PieChart{
        val pieChartData = FXCollections.observableArrayList(
            PieChart.Data("Grapefruit", 13.0),
            PieChart.Data("Oranges", 25.0),
            PieChart.Data("Plums", 10.0),
            PieChart.Data("Pears", 22.0),
            PieChart.Data("Apples", 30.0)
        )
        return PieChart(pieChartData)
    }

    private fun getBarChartCORS(): BarChart<String, Number>{
        val austria = "Austria"
        val brazil = "Brazil"
        val france = "France"
        val italy = "Italy"
        val xAxis = CategoryAxis()
        val yAxis = NumberAxis()

        val bc = BarChart(xAxis, yAxis)
        bc.title = "Country Summary"
        xAxis.label = "Country"
        yAxis.label = "Value"


        val series1: Series<*, *> = Series<Any?, Any?>()
        series1.name = "2003"
//        series1.data.add(Data<Any?, Any?>(austria, 25601.34))


        return bc
    }
}