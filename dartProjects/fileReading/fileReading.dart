import 'dart:convert';
import 'dart:io';
import 'package:googleapis/gmail/v1.dart' as gMail;
import 'package:googleapis_auth/auth_io.dart';

void main() {
  var filePath = 'C:/Users/rukmangadan/Documents/GitHub/token.json';
  var content = File(filePath).readAsStringSync();
  // print(content);

  final _credentials = new ServiceAccountCredentials.fromJson(content);
  var from = 'rubanjunk@gmail.com';
  var to = 'rubanjunk@gmail.com';

  gMail.Message.fromJson({
    'raw': getBase64Email(
        source: 'From: $from\r\n'
            'To: $to\r\n'
            'Subject: Jack\r\n'
            'Content-Type: $contentType; charset=$charset\r\n'
            'Content-Transfer-Encoding: $contentTransferEncoding\r\n\r\n'
            '$emailContent'), // emailContent is HTML table.
  });
}

String getBase64Email({String source}) {
  List<int> bytes = utf8.encode(source);
  String base64String = base64UrlEncode(bytes);

  return base64String;
}
