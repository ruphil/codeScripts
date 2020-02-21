package kotlinFXProjects.gifCreator

import javafx.collections.FXCollections
import javafx.event.EventHandler
import javafx.fxml.FXML
import javafx.scene.control.*
import javafx.stage.FileChooser
import java.io.File

class MainWindowController {
    @FXML
    var imageButton: Button? = null
    @FXML
    var doodleButton: Button? = null
    @FXML
    var imageLabel: Label? = null
    @FXML
    var doodleLabel: Label? = null
    @FXML
    var timeInterval: TextField? =  null
    @FXML
    var loopBool: ComboBox<Boolean>? = null
    @FXML
    var progressBar: ProgressBar? = null
    @FXML
    var startGIF: Button? = null

    fun initialize() {
        loopBool?.items = FXCollections.observableArrayList(false, true)
        loopBool?.value = false
        timeInterval?.text = 50.toString()

        imageButton?.onMouseClicked = EventHandler {
            val fileChooser = FileChooser()
            fileChooser.initialDirectory = File(".")
            fileChooser.title = "Open Image File"
            try{
                val file = fileChooser.showOpenDialog(null)
                imageLabel?.userData = file.absolutePath
                imageLabel?.text = file.name
            } catch(e: Throwable){}
        }

        doodleButton?.onMouseClicked = EventHandler {
            val fileChooser = FileChooser()
            fileChooser.initialDirectory = File(".")
            fileChooser.title = "Open Doodle File"
            try{
                val file = fileChooser.showOpenDialog(null)
                doodleLabel?.userData = file.absolutePath
                doodleLabel?.text = file.name
            } catch(e: Throwable){}
        }

        startGIF?.onMouseClicked = EventHandler {
            val imgPath = imageLabel?.userData.toString()
            val ddlPath = doodleLabel?.userData.toString()
            val interval = timeInterval?.text?.toInt()
            val loop = loopBool?.value

            makeGIF(arrayOf(imgPath, ddlPath), progressBar, interval!!, loop!!)

//            print("$imgPath, $ddlPath, $interval, $loop")
        }
    }
}