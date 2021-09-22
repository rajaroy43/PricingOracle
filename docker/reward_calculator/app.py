from datetime import datetime
from flask import Flask, request, jsonify
import requests
from Calculate_rewards import calculate_rewards
app = Flask(__name__)
import logging
LOGGER = logging.getLogger()

@app.route("/ping-node", methods=['GET'])
def ping_node():
    message = requests.get('http://reward_coordinator:9000').content.decode()
    response = dict(time=datetime.now(), message=message)
    return jsonify(response)


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
    rewards=calculate_rewards(data['msg'],2,4)

    response = dict(time=datetime.now(), message="you've request reward data")
    return jsonify(rewards.tolist())







