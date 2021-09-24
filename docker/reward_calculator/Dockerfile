FROM python:3.9.4-buster
RUN pip3 install --upgrade pip
COPY requirements.txt /

RUN pip3 install -r /requirements.txt

COPY app.py /
COPY Calculate_rewards.py /
COPY utils/ /utils/
ENV FLASK_RUN_PORT=9001
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:9001", "app:app"]
