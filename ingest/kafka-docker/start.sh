echo "127.0.0.1 $(hostname)" >> /etc/hosts
echo "127.0.0.1 localhost" >> /etc/hosts

sh bin/zookeeper-server-start.sh config/zookeeper.properties &
sleep 10
sh bin/kafka-server-start.sh config/server.properties &
sleep 10
sh bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic audioStream
tail -f /dev/null