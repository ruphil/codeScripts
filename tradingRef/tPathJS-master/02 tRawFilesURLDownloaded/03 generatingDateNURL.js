var startDate = new Date(2016, 00, 01, 12, 00)
var endstartDate = new Date(2019, 11, 31, 12, 00)

var generateDateInterval = setInterval(generateDate, 500)

function generateDate(){
    var isWeekend = (startDate.getDay() === 6) || (startDate.getDay() === 0)
    if(!isWeekend){
        downloadNUpload(startDate)
    }
    startDate.setDate(startDate.getDate() + 1)

    if (endstartDate.getTime() < startDate.getTime()){
        clearInterval(generateDateInterval)
    } 
}

function downloadNUpload(d){
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    var dayStr = d.getDate().toString().padStart(2, '0') 
    var monStr = monthNames[d.getMonth()]
    var yearStr = d.getFullYear().toString()

    var url = "https://www1.nseindia.com/content/historical/EQUITIES/" + yearStr + "/" + monStr + "/cm" + dayStr + monStr + yearStr + "bhav.csv.zip"
    console.log(url)
}