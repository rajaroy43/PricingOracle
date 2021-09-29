from datetime import datetime
from flask import Flask, request, jsonify
import requests
from Calculate_rewards import calculate_rewards
app = Flask(__name__)
import logging
LOGGER = logging.getLogger()

@app.route("/ping-me", methods=['GET'])
def ping_me():
    logging.info("someone's calling me")
    response = dict(time=datetime.now(), message="you've pinged the python server")
    return jsonify(response)

@app.route("/calculate-reward", methods=['POST'])
def calculate_group_reward():
    logging.info("Data Coming form cordinator")
    data = request.get_json()
    print(data['msg'])
    rewards=calculate_rewards(data['msg'])
    response = dict(rewards=rewards)
    return jsonify(response)







