#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function
from json import dumps
from kafka import KafkaProducer
from kafka.errors import KafkaError
import glob, os
import logging
logging.basicConfig(level=logging.INFO)

def on_send_success(record_metadata):
    print(record_metadata.topic)
    print(record_metadata.partition)
    print(record_metadata.offset)

def on_send_error(excp):
    print('err: ', exc_info=excp)

def main():
    producer = KafkaProducer(bootstrap_servers=[os.getenv('KAFKA_HOST')+':9092'],
     value_serializer=lambda x:
     dumps(x).encode('utf-8'), retries=5)
    files = glob.glob("speech/*.wav")
    for file in files:
        print(file + "\n")
        producer.send('audioStream', value=file).add_callback(on_send_success).add_errback(on_send_error).get(timeout=60)
    producer.flush()
        #future = (producer.send('audioStream', value=file))
        #try:
        #    record_metadata = future.get(timeout=10)
        #except KafkaError as e:
        #    print(e)
        #    pass # will eventually maybe want to handle if we cant commit data

if __name__ == '__main__':
    main()