const puppeteer = require('puppeteer')
const {google} = require('googleapis')
const privatekey = require('../../token.json')
const fs = require('fs')

let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
)

const sheetID_tBrowserAutomated = "19ZKAhEAuhfAE5yVazBQyvMuFRjdMSvd4FHP_OoFJPg4"
const sheetID_tURLDownloaded = "1SmP6l95Gyws2RPUY-H_vUqgAvsiHOhtXZQJE1znrLKk"
const sheetID_tCRONJob = "15S5Od4kRmVbv6a0K998sIeAS4LeNMaoJlgElY2jLwCc"

currentSheetID = sheetID_tCRONJob

const findDuplicates = (arr) => {
    let sorted_arr = arr.slice().sort(); // You can define the comparing function here. 
    // JS by default uses a crappy string compare.
    // (we use slice to clone the array so the
    // original array won't be modified)
    let results = [];
    for (let i = 0; i < sorted_arr.length - 1; i++) {
      if (sorted_arr[i + 1] == sorted_arr[i]) {
        results.push(sorted_arr[i]);
      }
    }
    return results;
}

google.sheets('v4').spreadsheets.values.get({
    auth: jwtClient,
    spreadsheetId: currentSheetID,
    range: 'filenames!A1:B'
}, function (_, response){
    filesInSheet = response.data.values

    var col1 = filesInSheet.map(function(value,index) { return value[0] })
    var col2 = filesInSheet.map(function(value,index) { return value[1] })

    console.log(`The duplicates in Column 1 are ${findDuplicates(col1)}`)
    console.log(`The duplicates in Column 2 are ${findDuplicates(col2)}`)
    console.log("Total Rows Count: ", filesInSheet.length)

})
