#!/usr/bin/env python

import os
import subprocess
import re
import time
import datetime
import sys
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('-t', type=int, default=-40, dest='threshold', help="Threshold of silence in decibals (default: -40)")
parser.add_argument('-d', type=float, default=0.2, dest='duration', help="Duration of silence before clipping (default: 0.2)")
parser.add_argument('-r', type=int, default=16000, dest='rate', help="Sample rate of audio (default: 16000)")
args = parser.parse_args()

INPUT_AUDIO_DIR = "./speech"
OUTPUT_AUDIO_DIR = "./audio"
OUTPUT_LOG_DIR = "./logs"
DECIBEL_THRESHOLD = args.threshold
DURATION = args.duration
SAMPLE_RATE = args.rate
CHANNELS = 1

# given a clip name and decibel threshold for silence, this will detect silence
# throughout the clip and give intervals so we know where to trim each clip
def detect_silence(clip):
    print("Detecting silence in " + clip + "...")

    inputClipPath = INPUT_AUDIO_DIR + "/" + clip
    outputLogPath = OUTPUT_LOG_DIR + "/" + clip + str(time.time()) + ".txt"
    
    # for logging the output, mainly testing purposes
    # os.system("ffmpeg -i {} -af silencedetect=noise={}dB:d={} -f null - 2> {}".format(inputClipPath, DECIBEL_THRESHOLD, DURATION, outputLogPath))
    # command line arguments for ffmpeg, stores log into output variable
    cmds = ["ffmpeg", "-i", inputClipPath, "-af", "silencedetect=noise={}dB:d={}".format(DECIBEL_THRESHOLD, DURATION), "-f", "null", "-", "2>&1"]
    # run as subprocess so we can grab the console output (shell=true since I am testing in VS code terminal)
    p = subprocess.Popen(cmds, stderr=subprocess.PIPE, stdin=subprocess.PIPE, stdout=subprocess.PIPE, shell=True)
    output, _ = p.communicate()
    print("output = " + str(output))

    # grab the next float/int after the word 'silence_start'
    startRegex = r'silence_start: (\d+\.*\d*)'
    startMatches = re.findall(startRegex, str(output))

    # do the same but for 'silence_end'
    endRegex = r'silence_end: (\d+\.*\d*)'
    endMatches = re.findall(endRegex, str(output))
    
    # if these are empty, either you are using Unix or the threshold/duration needs to be tweeked
    print("startMatches = " + str(startMatches))
    print("endMatches = " + str(endMatches))

    # check if silences were found
    if (len(startMatches) == 0):
        print("No silences found. Try adjusting the decibel threshold or silence duration.")
        return

    calculate_trim_times(clip, startMatches, endMatches)

def calculate_trim_times(clip, startMatches, endMatches):
    # calculate when to cut each clip
    for i in range(len(startMatches)-1):
        startTime = (float(startMatches[i]) + float(endMatches[i])) / 2
        endTime = (float(startMatches[i+1]) + float(endMatches[i+1])) / 2
        trim_clip(clip, round(startTime, 5), round(endTime, 5), i)


# given a clip and a calculated trim time with buffer, split the clip and store
# in a different directory
# may want a buffer before/after trim so the transcription has more evaluation time
def trim_clip(clip, startTime, endTime, index):
    print("Trimming clip", index, "from", startTime, "to", endTime)
    inputFile = INPUT_AUDIO_DIR + "/" + clip
    outputFile = OUTPUT_AUDIO_DIR + "/" + str(get_timestamp()) + ".wav"
    # outputFile = OUTPUT_AUDIO_DIR + "/" + str(time.time()) + ".wav"

    # output will be <unit timestamp>.wav
    os.system("ffmpeg -ss {} -to {} -i {} {}".format(startTime, endTime, inputFile, outputFile))

def get_timestamp():
    t = time.time()
    return str(datetime.datetime.fromtimestamp(t)).replace(".", ";").replace(":", ";").replace(" ", "_")

if __name__ == '__main__':
    # gathers all files (and folders) in directory
    audioFiles = os.listdir(INPUT_AUDIO_DIR)

    print("Converting to .wav 16 kHz mono...")
    for clip in audioFiles:
        if (not clip.endswith(".wav")):
            clipPath = INPUT_AUDIO_DIR + "/" + clip
            os.system("ffmpeg -i {} -ar {} -ac {} {}.wav".format(clipPath, SAMPLE_RATE, CHANNELS, clipPath[:-4]))

    audioFiles = os.listdir(INPUT_AUDIO_DIR)
    print("Clipping audio...")

    # go through each clip in the testing folder, will want to remove when done
    for clip in audioFiles:
        if (clip.endswith(".wav")):
            detect_silence(clip)
            # clipPath = INPUT_AUDIO_DIR + "/" + clip
            # os.remove(clipPath)

    print("New clips can be found in {}.".format(OUTPUT_AUDIO_DIR))
