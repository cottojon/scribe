# Building
```docker build . -t "consumer"```

# Creating
```docker create -e KAFKA_HOST=$CHANGEME  -v /home/username/demo/models:/app/models -v /home/username/demo/audio:/app/speech consumer```