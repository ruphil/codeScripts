var fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
var sleep = require('system-sleep');

var inOut = './inOut/';
var pagesPath = './inOut/pageChunks/';
var blankPagePath = './zblank/';

console.log('\nGetting Size of PDF ...\n');
exec(__dirname + '/dependencies/pdfinfo.exe ./input.pdf', (err, stdout, stderr) => {
  // console.log(stdout);
  // console.log(`stderr: ${stderr}`);
  var size = stdout.split('Page size:')[1].split('pts')[0].trim().split('x').map(el => { return parseInt(el)});
  var totalPages = parseInt(stdout.split('Pages:')[1].split('Encrypted:')[0]);

  console.log('\nSize: ', size, 'Total Pages:', totalPages, '\n');
  var width = size[0];
  var height = size[1];
  var halfHeight = height/2;

  var gsCommand = `gs -o "${inOut}odd.pdf" -sDEVICE=pdfwrite -dDEVICEWIDTHPOINTS=${width} -dDEVICEHEIGHTPOINTS=${halfHeight} -dFIXEDMEDIA -c "<</PageOffset [-0 -${halfHeight}]>> setpagedevice" -f "./input.pdf"`;
  exec(gsCommand, (err, stdout, stderr) => {
    // console.log(stdout);
    console.log('\nGot Odd Pages\n');
    var gsCommand = `gs -o "${inOut}even.pdf" -sDEVICE=pdfwrite -dDEVICEWIDTHPOINTS=${width} -dDEVICEHEIGHTPOINTS=${halfHeight} -dFIXEDMEDIA -c "<</PageOffset [-0 -0]>> setpagedevice" -f "./input.pdf"`;
    exec(gsCommand, (err, stdout, stderr) => {
      // console.log(stdout);
      console.log('\nGot Even Pages\n');
      console.log('\nNow Splitting Odd & Even Pages\n');
      var gsCommand = `gs -dBATCH -o "${pagesPath}odd_%d.pdf" -sDEVICE=pdfwrite -f "${inOut}odd.pdf"`;
      exec(gsCommand, (err, stdout, stderr) => {
        var gsCommand = `gs -dBATCH -o "${pagesPath}even_%d.pdf" -sDEVICE=pdfwrite -f "${inOut}even.pdf"`;
        exec(gsCommand, (err, stdout, stderr) => {
          var gsCommand = `gs -o "${blankPagePath}blank.pdf" -sDEVICE=pdfwrite -dDEVICEWIDTHPOINTS=${width} -dDEVICEHEIGHTPOINTS=${halfHeight} -dFIXEDMEDIA -c "<</PageOffset [-0 -0]>> setpagedevice" -f "blank.pdf"`;
          exec(gsCommand, (err, stdout, stderr) => {
            console.log('\nNow Fitting the Blank Page\n');
            // var totalPages = 14;
            var pages = [];
            for (var i = 1; i <= totalPages; i++){
              pages.push(`odd_${i}.pdf`);
              pages.push(`even_${i}.pdf`);
            }
            // console.log(pages);

            var ordering = fs.readFileSync('./ordering.txt', 'utf-8');
            var groupings = ordering.split(";");
            var pagesClusterString = "";

            groupings.forEach(function (group, groupIndex){
              var pageEqualizer = 0;
              var subgroups = group.split(',');
              
              subgroups.forEach(function (subgroup, subGIndex){
                var indexes = subgroup.split('-');
                var start = parseInt(indexes[0]);
                var end = parseInt(indexes[1]);
                
//                 console.log(end);
                if (isNaN(end)) {
                  console.log('ya its not a number');
                  end = start;
                }

                for (var p = start; p <= end; p++){
                  pagesClusterString += pagesPath + pages[p-1] + " ";

                  pageEqualizer++;
                }
              });

              var pageEqualizerChecker = (4 - pageEqualizer % 4);
              if (pageEqualizerChecker != 4){
                while(pageEqualizerChecker--){
                  pagesClusterString += blankPagePath + "blank.pdf ";
                }
              }
            });
            // console.log('\n',pagesClusterString, '\n');
            var gsCommand = `gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile=./toPrint.pdf ${pagesClusterString}`;
            console.log('\n', gsCommand, '\n');
            exec(gsCommand, (err, stdout, stderr) => {
              console.log('\n toPrintFile Ready\n');
              
              fs.readdir(inOut, (err, files) => {
                if (err) throw err;
                console.log('\n Removing Temporary Files\n');
                for (const file of files) {
                  fs.unlink(path.join(inOut, file), err => {
                    if (err) throw err;
                  });
                }
              });

              sleep(3000);
              fs.readdir(pagesPath, (err, files) => {
                if (err) throw err;
              
                for (const file of files) {
                  fs.unlink(path.join(pagesPath, file), err => {
                    if (err) throw err;
                  });
                }
                console.log('\nFinally Done\n');
              });
              
            });
          });
        });
      });
    });
  });
});



// exec('gs -o "inputcrp.pdf" -sDEVICE=pdfwrite -dDEVICEWIDTHPOINTS=612 -dDEVICEHEIGHTPOINTS=396 -dFIXEDMEDIA -c "<</PageOffset [-0 -0]>> setpagedevice" -f "input.pdf"', (err, stdout, stderr) => {
//   if (err) {
//     // node couldn't execute the command
//     return;
//   }

//   // the *entire* stdout and stderr (buffered)
//   console.log(`stdout: ${stdout}`);
//   console.log(`stderr: ${stderr}`);
// });
