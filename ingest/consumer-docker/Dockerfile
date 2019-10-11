FROM clearlinux

RUN swupd update
RUN swupd bundle-add python3-basic
RUN pip3 install kafka-python deepspeech pg8000

WORKDIR /app

COPY audrey.py /app

CMD ["python3","audrey.py"]