from jinja2 import Template
from cgi import parse_qs
from PIL import Image
import base64
import pytesseract
from io import BytesIO

def application(environ, start_response):
    try:
        request_body_size = int(environ.get('CONTENT_LENGTH', 0))
    except (ValueError):
        request_body_size = 0

    request_body = environ['wsgi.input'].read(request_body_size)
    d = parse_qs(request_body)
    try:
        dataURI = bytes.decode(d.get(b'cropped_dataURI')[0])
    except:
        dataURI = ""

    convTXT = None
    try:
        imgstring = dataURI.split('base64,')[-1].strip()
        image = Image.open(BytesIO(base64.b64decode(imgstring)))

        tessdata_dir_config = '--tessdata-dir "/home/rukmangadan91/tessdata"'
        convTXT = pytesseract.image_to_string(image, lang='hin', config=tessdata_dir_config)
        dataURI = ""
    except:
        convTXT = None

    template_values = {
        'dataURI': dataURI,
        'conv_txt': convTXT
    }

    if environ.get('PATH_INFO') == '/':
        with open('/home/rukmangadan91/site_content/index.html', 'r') as content_file:
            file_str = content_file.read()
        t = Template(file_str)
        content = t.render(template_values)
        status = '200 OK'
    elif environ.get('PATH_INFO') == '/hindiocr':
        with open('/home/rukmangadan91/site_content/hindiocr.html', 'r') as content_file:
            file_str = content_file.read()
        t = Template(file_str)
        content = t.render(template_values)
        status = '200 OK'
    else:
        status = '404 NOT FOUND'
        content = 'Page not found.'
    response_headers = [('Content-Type', 'text/html'), ('Content-Length', str(len(content)))]
    start_response(status, response_headers)
    yield content.encode('utf8')
