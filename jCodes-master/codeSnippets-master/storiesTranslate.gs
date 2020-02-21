function translate() {
  //// Specify ID
  var id = "12EqMvB9E-UHrNqwWmskzYVbIB3G3pQdLB2vAyNG3bzY";
  
  //// Getting Text
  var doc_name = DocumentApp.openById(id).getName()
  var doc = DocumentApp.openById(id).getBody().getText()
//  Logger.log(doc)
  
  //// Splitting Lines
  var doc_lines = doc.split("।");
  doc_lines.splice(-1,1)
//  Logger.log(doc_lines)
  
  //// Splitting Words
  var doc_words = []
  var index = 0
  for (var line in doc_lines){
    doc_words[index] = doc_lines[line].split(" ")
    index += 1
//    Logger.log(doc_lines[line])
  }
//  Logger.log(doc_words)
  
  //// Create an Empty doc in Parent folder
  var blnk_file_id = DocumentApp.create(doc_name + "_translated").getId()
  var fldr_id = DriveApp.getFileById(id).getParents().next().getId()
  DriveApp.getFolderById(fldr_id).addFile(DriveApp.getFileById(blnk_file_id))
  
  //// Getting new Doc body for writing
  var new_doc_body = DocumentApp.openById(blnk_file_id).getBody()
  
  //// Translating and Writing
  for (var line in doc_lines){
    var doc_para = ""
    
    // Each word translation
    var wrds_line = ""
    for (var wrd in doc_words[line]){
      var trans_wrd = LanguageApp.translate(doc_words[line][wrd], 'hi', 'en');
      wrds_line += doc_words[line][wrd] + " (" + trans_wrd + ")  "
      Utilities.sleep(200)
    }
    wrds_line = wrds_line.replace(/,\s*$/, "")
    doc_para += wrds_line + "breakingbreakingbreaking"
    
    // Sentence Translation
    var trnslt_line = LanguageApp.translate(doc_lines[line], 'hi', 'en');
    doc_para += trnslt_line + "bigbigbigbigbigenter"
    doc_para = doc_para.replace(/\r?\n|\r/g,"")
    doc_para = doc_para.replace(/breakingbreakingbreaking/g,"\n\n")
    doc_para = doc_para.replace("bigbigbigbigbigenter","\n\n")
    
    // Appending Para
    new_doc_body.appendParagraph(doc_para)
  }
}
