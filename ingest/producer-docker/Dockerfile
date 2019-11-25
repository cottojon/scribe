FROM clearlinux       

RUN swupd update
RUN swupd bundle-add python3-basic curl
RUN pip3 install kafka-python

WORKDIR /app
COPY producer.py /app

CMD ["python3","producer.py"]
