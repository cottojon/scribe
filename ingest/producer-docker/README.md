# Building
```docker build . -t "producer"```

# Creating
```docker create -e KAFKA_HOST=$CHANGEME -v /home/username/demo/audio:/app/speech producer```