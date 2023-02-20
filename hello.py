from flask import Flask, request, render_template
from reminder import send_sms
import datetime


app = Flask(__name__, template_folder="template", static_folder="static")

@app.route("/sendSmsFlereGange/", methods=["POST"])
def sendMultiple():
    messages = readMessagesContent()
    if request.method == "POST":
        tlf = request.form.get("telefon")
        tlf = "45_" + tlf[:4] + "_" + tlf[4:]
        date = request.form.get("date")
        clock = request.form.get("dato") + str(":0")
        dateFormat = datetime.datetime.strptime(date + " " + clock, "%Y-%m-%d %H:%M:%S")
        unixTime = datetime.datetime.timestamp(dateFormat)
        #Dag 0 besked
        #send_sms("ForskningNu", message.message, newUnixTime, [tlf])

        
        

        
        for message in messages:
            if (message.day % 2 == 0): a = 24
            else: a = 144
            newUnixTime = unixTime + ((message.day-1) * a) * 60 * 60
            dt = datetime.datetime.fromtimestamp(newUnixTime)
            print("Sender besked for dag ",message.day," ved UNIX ",newUnixTime, dt)
            #send_sms("ForskningNu", message.message, newUnixTime, [tlf])
      
    return render_template('frontend2.html', messages=messages)

@app.route("/")
def index3():
    messages = readMessagesContent()
    return render_template('frontend2.html', messages=messages)

@app.route("/cheatsheet/")
def cheetsheet():
    return render_template('frontend.html')
    
          
        
if __name__=='__main__':
    app.run(debug = True)


def readMessagesContent():
    with app.open_resource('static/texts.txt') as f:
        messages = f.read().splitlines()
    messages = [x.decode('UTF8') for x in messages]
    result = []
    count = 0
    for message in messages:
        result.append(Message(message, count+1))
        count += 1
    return result

class Message:
  def __init__(self, message, day):
    self.message = message
    self.day = day

