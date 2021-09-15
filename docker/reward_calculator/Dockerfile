FROM python:3.9.4-alpine3.13
COPY requirements.txt /

RUN pip3 install -r /requirements.txt

COPY app.py /
ENV FLASK_RUN_PORT=9001
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:9001", "app:app"]
