package kotlinFXProjects

import javafx.application.Application
import javafx.fxml.FXMLLoader
import javafx.scene.Parent
import javafx.scene.Scene
import javafx.scene.image.Image
import javafx.stage.Stage
import java.io.File
import java.io.FileInputStream

class KotlinFX: Application() {

    // Required Variables   --------------------------------------------------------------------
    private var fxmlPath = "Projects/01_gifCreator/gifcreator.fxml"
    private var title = "GIF Creator"
    // Required Variables   --------------------------------------------------------------------

    override fun start(stage: Stage) {
        val fxmlFile = javaClass.classLoader.getResource(fxmlPath)
        val root = FXMLLoader.load<Parent>(fxmlFile)
        val scene = Scene(root)
        stage.scene = scene
        stage.isResizable = false
        stage.title = title

        val iconImg = javaClass.classLoader.getResource("icon.png")!!.toURI()
        val fileStream = FileInputStream(File(iconImg))
        val imgIcon = Image(fileStream)
        stage.icons.add(imgIcon)
        stage.show()
    }

    companion object{
        @JvmStatic
        fun main(args: Array<String>){
            launch(KotlinFX::class.java)
        }
    }
}

