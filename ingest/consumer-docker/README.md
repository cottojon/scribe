# Building
```docker build . -t "consumer"```

# Creating
```docker create -e KAFKA_HOST=$CHANGEME -e dbhost="" -e db="" -e user="" -e password="" -e dbport="" -v /home/username/demo/models:/app/models -v /home/username/demo/audio:/app/speech consumer```
