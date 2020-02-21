package kotlinScripts

import java.io.File

fun makeFolders(){
    println("starting to Make Folders")

    val outputDir = "out/04"

    val file = File("res/subjects.txt")
    val fileContent = file.readLines()
//    println(fileContent)

    for ((index, subject) in fileContent.withIndex()){
        val number = index.toString().padStart(2, '0')
        (File("$outputDir/$number $subject")).mkdirs()
    }
}