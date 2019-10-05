FROM alpine
RUN apk add --no-cache --virtual .build-deps g++ python3-dev libffi-dev openssl-dev && \
    apk add --no-cache --update python3 && \
    pip3 install --upgrade pip setuptools
RUN pip3 install kafka-python
WORKDIR /app

COPY producer.py /app

CMD ["python3","producer.py"]