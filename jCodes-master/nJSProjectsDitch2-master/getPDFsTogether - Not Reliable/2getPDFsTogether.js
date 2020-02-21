var fs = require('fs');
var scissors = require('scissors');

var oddPDF = scissors('./odd.pdf');
var evenPDF = scissors('./even.pdf');
var blankPDF = scissors('./inOut/blank.pdf');

Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
};

oddPDF.getNumPages().then(totalPages => {
    var pageOrderingArray = [];
    var blankPageIndex = totalPages * 2 + 1;

    for (var i = 1; i <= totalPages; i++){
        pageOrderingArray.push(i);
        pageOrderingArray.push(totalPages + i);
    }
    pageOrderingArray.push(blankPageIndex);
    // console.log(pageOrderingArray)

    var ordering = fs.readFileSync('./ordering.txt', 'utf-8');
    var groupings = ordering.split(",");
    var adjustedPageOrdering = [];
    groupings.forEach(function (group, groupIndex){
      var pageEqualizer = 0;
      var indexes = group.split('-');
      var start = parseInt(indexes[0]);
      var end = parseInt(indexes[1]);
      for (var p = start; p <= end; p++){
        adjustedPageOrdering.push(p);

        pageEqualizer++;
      }
      var pageEqualizerChecker = (4 - pageEqualizer % 4);
      if (pageEqualizerChecker != 4){
        while(pageEqualizerChecker--){
            adjustedPageOrdering.push(blankPageIndex);
        }
      }
    });

    // console.log(adjustedPageOrdering);
    console.log('\nNow combining PDFs blindly ...\n')
    scissors.join(oddPDF, evenPDF, blankPDF)
        .pages(pageOrderingArray)
        .pdfStream()
        .pipe(fs.createWriteStream('./inOut/out.pdf')).on('finish', function(){
            console.log('\nSorting Out the Pages Now ...\n');
            scissors('./inOut/out.pdf')
            .pages(adjustedPageOrdering)
            .pdfStream()
            .pipe(fs.createWriteStream('./toPrint.pdf')).on('finish', function(){
                console.log('\nprintFile Ready\n');
            });
        })
});
// scissors.join(oddPDF, evenPDF)
//     .pages([1,2]).getNumPages().then(data => console.log(data))
    // .getNumPages().then(totalPages => {
    //     return new Promise((resolve, reject) => {
    //         if (true) {
    //           return resolve([totalPages]);
    //         } else {
    //           return reject("promise failed");
    //        }
    //     });
    // }).then(data => {
    //     console.log(data)
    // })
    
// .then(jack => {
//     console.log(jack)
// })



// // const fs = require('mz/fs');
// // const {splitPDF} = require('pdf-toolz/SplitCombine');

// // var oddPDF = fs.readFileSync('./odd.pdf');
// // var evenPDF = fs.readFileSync('./even.pdf');

// // splitPDF(oddPDF).then(data => {
// //     console.log(data)
// // })



// const pdftk = require('node-pdftk');
// const fs = require('fs');

// pdftk.input({
//     O: './odd.pdf',
//     E: './even.pdf'
// }).output('./2pagefile.pdf').then(buffer => {
//     console.log(buffer.length)
// })