function rename() {
  var information_fileName = 'info'
  var photo_fileName = 'photo'
  var files = DriveApp.getFolderById('17kggBNz6p5WqnppZOPTXL6Twgr1qZ6Ix').getFilesByName(information_fileName)
  while (files.hasNext()){
    var file = files.next()
    if (file.getName() != file.getId()){
      file.setName(file.getId())
    }
  }
}
