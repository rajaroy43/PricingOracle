from datetime import datetime
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)
import logging
LOGGER = logging.getLogger()

@app.route("/ping-node", methods=['GET'])
def ping_node():
    message = requests.get('http://reward_coordinator:8000').content.decode()
    response = dict(time=datetime.now(), message=message)
    return jsonify(response)


@app.route("/ping-me", methods=['GET'])
def ping_me():
    logging.info("someone's calling me")
    response = dict(time=datetime.now(), message="you've pinged the python server")
    return jsonify(response)







