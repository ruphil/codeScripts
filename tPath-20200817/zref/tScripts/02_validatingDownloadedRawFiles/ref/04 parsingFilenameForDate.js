var fileName = "cm10OCT2018bhav.csv.zip"

const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

var date = fileName.substring(2, 4)
var monStr = (parseInt(monthNames.indexOf(fileName.substring(4, 7))) + 1).toString().padStart(2, '0')
var year = fileName.substring(7, 11)

var dateStr = year + "-" + monStr + "-" + date
console.log(dateStr)