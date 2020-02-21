package kotlinScripts

import org.apache.commons.io.FileUtils
import org.jsoup.Jsoup
import java.io.File
import java.net.URL

var outDir = "out/03/"

fun parseWebData(){
    (File(outDir)).mkdirs()
    println("Getting Data")

    // Download from InsightsonIndia.com
    val url = "https://www.insightsonindia.com/insights-mindmaps-on-important-current-issues-for-upsc-civil-services-exam/"
    val cssQry = "a[title*=MINDMAP]"
    val subCSSQry = "a[href*=.jpg]"
    // Download from InsightsonIndia.com

    val doc = Jsoup.connect(url).get()
    val elems = doc.select(cssQry)
    val totalFiles = elems.size
    println(totalFiles)

    var counter = 0
    for (elm in elems){
//        println(elm.attr("href"))
        val subURL = elm.attr("href")
        val subDoc = Jsoup.connect(subURL).get()
        val subElems = subDoc.select(subCSSQry)
        val fileURL = subElems[0].attr("href")

        val fileParts = fileURL.split(".jpg")
        val fileName = fileParts[0].split("/").last() + ".jpg"
//        println(fileName)

        downloadFile(fileURL, fileName)
        print("File $counter of $totalFiles - $fileName downloaded")

        Thread.sleep(1_000)
        counter++
        if(counter > 5) break
    }
}

fun downloadFile(fileURL: String, fileName: String) {
    FileUtils.copyURLToFile(URL(fileURL), File(outDir + fileName))
}

