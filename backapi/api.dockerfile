FROM python:3.9

COPY configuration.py /configuration.py
COPY models.py /models.py
COPY main.py /main.py
COPY requirements.txt /requirements.txt

RUN pip install -r ./requirements.txt

ENTRYPOINT [ "python", "main.py" ]