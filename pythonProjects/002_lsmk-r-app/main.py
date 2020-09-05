from flask import Flask, render_template, jsonify, request
from google.oauth2 import service_account
from apiclient import discovery
from os.path import expanduser

data_sheet_ID = "1mC_NrKCL-G9RC36wxwJWplZVe0w2bcMoz_3xb8ccNps"
wrsubmit_log_sheet_ID = "1goXiwcFxWWBh1H_hzwD3HV5J1KPFi5T27Zr_nGOUQn8"
dfsubmit_log_sheet_ID = "1wizsDZEYFDwW1yHiOAw8y9d_b9sJx2uLG2DftTCoQN0"

scopes = ["https://www.googleapis.com/auth/spreadsheets"]
secret_file = "./credentials/lsmk-r-d5494b4cb17a.json"
credentials = service_account.Credentials.from_service_account_file(secret_file, scopes=scopes)
service = discovery.build('sheets', 'v4', credentials=credentials)

app = Flask(__name__)

# Field Website Routes ----------------------------------------------------------
@app.route('/')
def field():
    return render_template('field_ahome.html')

@app.route('/wr')
def wr():
    return render_template('field_wr.html')

@app.route('/df')
def df():
    return render_template('field_df.html')

@app.route('/dt')
def dt():
    return render_template('field_dt.html')

@app.route('/initprocess')
def initprocess():
    return render_template('field_initprocess.html')

# Field Fetch Data Routes ----------------------------------------------------------
@app.route('/sitedata')
def sitedata():
    range_names = [
        'dataToSite!A2:A50',
        'dataToSite!B2:B100',
        'taluks!A2:B300'
    ]
    result = service.spreadsheets().values().batchGet(spreadsheetId=data_sheet_ID, ranges=range_names).execute()
    ranges = result.get('valueRanges', [])

    ranges.append("success")
    return jsonify(ranges)

@app.route('/dtdata')
def dtdata():
    range_name = 'dataToSite!A2:A50'

    result = service.spreadsheets().values().get(spreadsheetId=data_sheet_ID, range=range_name).execute()
    rows = result.get('values', [])

    rows.append("success")
    return jsonify(rows)

@app.route('/searchflights')
def searchflights():
    dronenumber = request.args['dronenumber']
    registerdate = request.args['registerdate']
    flownflightstatus = request.args['flownflightstatus']

    range_name = 'register!A2:AJ1000'

    result = service.spreadsheets().values().get(spreadsheetId=dfsubmit_log_sheet_ID, range=range_name).execute()
    rows = result.get('values', [])

    result_rows = []
    for index, row in enumerate(rows):
        if(row[0] == dronenumber and row[1] == registerdate and row[33] == flownflightstatus):
            result_rows.append([index, row])

    return jsonify(result_rows)

# Field Submit Data Routes ----------------------------------------------------------
@app.route('/wrsubmit', methods=['POST'])
def wrsubmit():
    jsonData = request.json

    body = {
        'values': jsonData['values']
    }

    result = service.spreadsheets().values().append(spreadsheetId=wrsubmit_log_sheet_ID, range='wind!A:M', valueInputOption='RAW', body=body).execute()
    result.get('updates')
    return "success"

@app.route('/dfsubmit', methods=['POST'])
def dfsubmit():
    jsonData = request.json

    body = {
        'values': jsonData['values']
    }

    result = service.spreadsheets().values().append(spreadsheetId=dfsubmit_log_sheet_ID, range='register!A:AJ', valueInputOption='RAW', body=body).execute()
    result.get('updates')
    return "success"

@app.route('/dtsubmit', methods=['POST'])
def dtsubmit():
    jsonData = request.json

    body = {
        'values': jsonData['values']
    }

    flightIndexInSheet = jsonData['flightIndexInSheet']
    range = 'register!AJ' + str(flightIndexInSheet) + ':AW' + str(flightIndexInSheet)
    print(range)

    result = service.spreadsheets().values().update(spreadsheetId=dfsubmit_log_sheet_ID, range=range, valueInputOption='RAW', body=body).execute()
    result.get('updates')
    return "success"

# Office Website Routes ----------------------------------------------------------

@app.route('/office')
def office():
    return render_template('office_ahome.html')

@app.route('/dp')
def dp():
    return render_template('office_dp.html')

@app.route('/dd')
def dd():
    return render_template('office_dd.html')

@app.route('/monitor')
def monitor():
    return render_template('office_monitor.html')

@app.route('/getmonitordata')
def getdataMonitor():
    monitor_range = [
        'register!S2:S100',
    ]
    monitor_result = service.spreadsheets().values().batchGet(spreadsheetId=log_sheet_ID, ranges=monitor_range).execute()
    monitor_ranges = monitor_result.get('valueRanges', [])

    return jsonify(monitor_ranges)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)