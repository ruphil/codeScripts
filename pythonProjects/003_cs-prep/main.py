from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route('/')
def field():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)