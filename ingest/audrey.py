#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function
from deepspeech import Model
from json import loads
from kafka import KafkaConsumer 
from timeit import default_timer as timer

import argparse
import numpy as np
import shlex
import subprocess
import sys
import wave

try:
    from shhlex import quote
except ImportError:
    from pipes import quote

# These constants control the beam search decoder
BEAM_WIDTH = 500
LM_ALPHA = 0.75
LM_BETA = 1.85
N_FEATURES = 26
N_CONTEXT = 9


def convert_samplerate(audio_path):
    sox_cmd = 'sox {} --type raw --bits 16 --channels 1 --rate 16000 --encoding signed-integer --endian little --compression 0.0 --no-dither - '.format(quote(audio_path))
    try:
        output = subprocess.check_output(shlex.split(sox_cmd), stderr=subprocess.PIPE)
    except subprocess.CalledProcessError as e:
        raise RuntimeError('SoX returned non-zero status: {}'.format(e.stderr))
    except OSError as e:
        raise OSError(e.errno, 'SoX not found, use 16kHz files or install it: {}'.format(e.strerror))

    return 16000, np.frombuffer(output, np.int16)

def metadata_to_string(metadata):
    return ''.join(item.character for item in metadata.items)

def notify_db(filename, transcription):
	# For now just print, we should notify postgres with like pg8000/sqlalch
	print(str([filename, transcription]))

def transcribe(audioFile):
    model_load_start = timer()
    ds = Model("models/output_graph.pbmm", N_FEATURES, N_CONTEXT, "models/alphabet.txt", BEAM_WIDTH)
    ds.enableDecoderWithLM("models/alphabet.txt", "models/lm.binary", "models/trie", LM_ALPHA, LM_BETA)

    fin = wave.open(audioFile, 'rb')
    fs = fin.getframerate()
    if fs != 16000:
        #print('Warning: original sample rate ({}) is different than 16kHz. Resampling might produce erratic speech recognition.'.format(fs), file=sys.stderr)
        fs, audio = convert_samplerate(audioFile)
    else:
        audio = np.frombuffer(fin.readframes(fin.getnframes()), np.int16)

    audio_length = fin.getnframes() * (1/16000)
    fin.close()

    #if args.extended:
    notify_db(audioFile, metadata_to_string(ds.sttWithMetadata(audio, fs)))
    #else:
    #print(ds.stt(audio, fs))

if __name__ == '__main__':
    consumer = KafkaConsumer(
     'audioStream',
     bootstrap_servers=['localhost:9092'],
     auto_offset_reset='earliest',
     enable_auto_commit=True,
     auto_commit_interval_ms=500,
     group_id='scribes',
     value_deserializer=lambda x: loads(x.decode('utf-8')))

    for message in consumer:
        message = message.value
        transcribe(message)

