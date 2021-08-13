FROM python:3.9.4-alpine3.13
COPY requirements.txt /

RUN pip3 install -r /requirements.txt

COPY app.py /

CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:8001", "app:app"]
