const http = require('http')
const fs = require('fs')

const server = http.createServer(function (req, res) {
    var reportParams = req.url.toString().split("/")
    var reportName = reportParams[1]
    var reportView = reportParams[2]
    var refreshMilliSeconds = reportParams[3]
    // console.log(reportName)
    // console.log(reportView)

    if(reportName != 'favicon.ico' && reportView == undefined){
        res.write('Welcome to Google Compute Engine')
    } else if (reportView != undefined){
        handleReports(res, reportName, reportView, refreshMilliSeconds)
    }
    res.end()
})

server.listen(80)
// const PORT = process.env.PORT || 8080
// server.listen(PORT, function(){
//     console.log('listening on *: ' + PORT)
// })

function handleReports(res, reportName, reportView, refresh){
    var reportsDir = "00 reportsTrading/"
    var reportPath = reportsDir + reportName
    // console.log(reportPath)

    res.writeHead(200, {'Content-Type': 'text/html'})
    
    res.write('<body>')

    var reportContent
    try {
        reportFile = fs.readFileSync(reportPath, 'utf-8')
        var reportLines = reportFile.split("\n")

        switch (reportView){
            case "full":
                fullContent = []
                for (var i = 0; i < reportLines.length; i++){
                    fullContent.push(reportLines[i])
                }
                reportContent = fullContent.join("</br>")
                break
            case "head":
                headContent = []
                for (var i = 0; i < 5; i++){
                    headContent.push(reportLines[i])
                }
                reportContent = headContent.join("</br>")
                break
            case "tail":
                tailContent = []
                for (var i = 15; i >= 1; i--){
                    tailContent.push(reportLines[reportLines.length - i])
                }
                reportContent = tailContent.join("</br>")
                break
            case "reverse":
                reverseContent = []
                for (var i = 1; i <= reportLines.length; i++){
                    reverseContent.push(reportLines[reportLines.length - i])
                }
                reportContent = reverseContent.join("</br>")
                break
            default:
                reportContent = reportFile
        }

    } catch(e) {
        reportContent = "No Such Report Available"
    }
    
    res.write(reportContent)

    if (refresh != undefined && isFinite(refresh)){
        var refreshScript = `
            <script>
            setTimeout( function () { window.location.reload(true) }, ${refresh})
            </script>
        `
        res.write(refreshScript)
    }

    res.write('</body>')
}
