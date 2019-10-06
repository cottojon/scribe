from os import listdir, system
from os.path import isfile, join
import csv # in case we want to store time intervals in a table
import subprocess
import re

# redo using command line arguments
INPUT_AUDIO_DIR = "./InputAudio"
OUTPUT_AUDIO_DIR = "./OutputAudio"
DECIBEL_THRESHOLD = -40;
DURATION = 0.2

# given a clip name and decibel threshold for silence, this will detect silence
# throughout the clip and give intervals so we know where to trim each clip
def detect_silence(clip):
    print("Detecting silence in " + clip + "...")

    inputClipPath = INPUT_AUDIO_DIR + "/" + clip
    outputLogPath = OUTPUT_AUDIO_DIR + "/logs/" + clip[:-4] + "_output.txt"
    
    # for logging the output, mainly testing purposes
    system("ffmpeg -i {} -af silencedetect=noise={}dB:d={} -f null - 2> {}".format(inputClipPath, DECIBEL_THRESHOLD, DURATION, outputLogPath))

    # command line arguments for ffmpeg, stores log into output variable
    cmds = ["ffmpeg", "-i", inputClipPath, "-af", "silencedetect=noise={}dB:d={}".format(DECIBEL_THRESHOLD, DURATION), "-f", "null", "-", "2>&1"]

    # run as subprocess so we can grab the console output (shell=true since I am testing in VS code terminal)
    p = subprocess.Popen(cmds, stderr=subprocess.PIPE, stdin=subprocess.PIPE, stdout=subprocess.PIPE, shell=True)
    output, _ = p.communicate()
    # print(str(output))

    # grab the next float/int after the word 'silence_start'
    silenceStart = re.compile(r'silence_start: (\d+\.*\d*)')
    startMatches = silenceStart.findall(str(output))

    # do the same but for 'silence_end'
    silenceEnd = re.compile(r'silence_end: (\d+\.*\d*)')
    endMatches = silenceEnd.findall(str(output))

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
    outputFile = OUTPUT_AUDIO_DIR + "/" + clip[:-4] + str(index) + ".wav"
    system("ffmpeg -ss {} -to {} -i {} {}".format(startTime, endTime, inputFile, outputFile))


if __name__ == '__main__':
    # gathers all files (and folders) in directory
    audioFiles = listdir(INPUT_AUDIO_DIR)

    print("Detecting silence...")

    # go through each clip in the testing folder, will want to remove when done
    for clip in audioFiles:
        # or .avi, .mpeg, whatever. for testing, i'm using wav
        if (clip.endswith(".wav")):
            detect_silence(clip)
        else:
            continue

    print("Console output for each clip can be found in '/AudioOutput/logs'")