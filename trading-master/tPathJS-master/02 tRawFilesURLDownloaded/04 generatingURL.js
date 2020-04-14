var url = "https://www1.nseindia.com/content/historical/EQUITIES/2017/SEP/cm13SEP2017bhav.csv.zip"

var d = new Date(2016, 00, 01, 12, 00)

const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
var dayStr = d.getDate().toString().padStart(2, '0') 
var monStr = monthNames[d.getMonth()]
var yearStr = d.getFullYear().toString()

var url = "https://www1.nseindia.com/content/historical/EQUITIES/" + yearStr + "/" + monStr + "/cm" + dayStr + monStr + yearStr + "bhav.csv.zip"
console.log(url)
