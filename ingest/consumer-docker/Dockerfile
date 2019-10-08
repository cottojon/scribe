FROM clearlinux/python

RUN swupd update

RUN pip3 install kafka-python deepspeech

WORKDIR /app

COPY audrey.py /app

CMD ["python3","audrey.py"]