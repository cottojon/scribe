# Building
```docker build . -t "kafka"```

# Creating
```docker create -e KAFKA_HOST=changeme --ulimit nofile=122880:122880 -m 2G --net=host kafka```