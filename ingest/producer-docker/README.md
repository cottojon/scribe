# Building
```docker build . -t "producer"```

# Creating
```docker create -e KAFKA_HOST=$CHANGEME -v /home/username/demo/audio:/app/speech producer```

# Split_Clips.py
### Building
```bash
docker build -t split-dat-clip .
```
### Running (w/ arugments)
```bash
docker run -ti split-dat-clip /split_clips.py -t -40 -d 0.2 -r 16000
```

### Running (w/o arugments - uses defaults)
```bash
docker run split-dat-clip
```

### Optional Arguments
```
-h, --help    show this help message and exit
-t THRESHOLD  Threshold of silence in decibals (default: -40)
-d DURATION   Duration of silence before clipping (default: 0.2)
-r RATE       Sample rate of audio (default: 16000)
```
Tweak these values if you aren't getting any output

### Additional Info
Input is audio clips from `/speech`
Output will be the splitted clips in `/audio`
`/logs` is for debugging the ffmpeg output. Uncomment `line: 34` to generate logs

Currently not working on WSL. `subprocess` is executing, but not storing the output to be retieved by `communicate()`. Works fine on Windows. Problem either lies on `line: 36 - 2>&1` (output standard error into standard output) or on `line: 38 - using PIPE to store stderr/stdout/stdin` (subprocess docs say that's how it's supposed to work so idk)