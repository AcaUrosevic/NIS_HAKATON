FROM python:3.9

WORKDIR /
COPY ./data/event.csv /data/event.csv
COPY ./data/tele.csv /data/tele.csv
COPY model.pkl /model.pkl
COPY configuration.py /configuration.py
COPY models.py /models.py
COPY main.py /main.py
COPY requirements.txt /requirements.txt

RUN pip install -r ./requirements.txt

ENTRYPOINT [ "python", "main.py" ]