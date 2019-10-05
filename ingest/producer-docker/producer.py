#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function
from json import dumps
from kafka import KafkaProducer
from kafka.errors import KafkaError
import glob


def main():
    producer = KafkaProducer(bootstrap_servers=['localhost:9092'],
     value_serializer=lambda x: 
     dumps(x).encode('utf-8'))
    files = glob.glob("speech/*.wav")
    for file in files:
        future = (producer.send('audioStream', value=file))
        try:
            record_metadata = future.get(timeout=10)
        except KafkaError:
            pass # will eventually maybe want to handle if we cant commit data

if __name__ == '__main__':
    main()