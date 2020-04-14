var date = new Date(2001, 00, 01, 12, 00)
var endDate = new Date(2019, 11, 31, 12, 00)

var lastDateReached = false
var totalCount = 0
while (!lastDateReached){
    var isWeekend = (date.getDay() === 6) || (date.getDay() === 0)
    if(!isWeekend){
        var dateStr = date.getDate().toString().padStart(2, '0') + "-" + (date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getFullYear().toString()
        console.log(dateStr)
        totalCount++
    }
    date.setDate(date.getDate() + 1)

    if (endDate.getTime() < date.getTime()){
        console.log(totalCount)
        lastDateReached = true
    } 
}
