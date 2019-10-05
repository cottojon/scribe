# Dockerfile
FROM openjdk:12-alpine

RUN apk --update --no-cache add bash \
    curl \
    tar \
    screen

WORKDIR /app
COPY start.sh /app

RUN curl http://mirror.metrocast.net/apache/kafka/2.3.0/kafka_2.12-2.3.0.tgz -o kafka.tgz
RUN tar -xvf kafka.tgz kafka_2.12-2.3.0/
RUN mv kafka_2.12-2.3.0/ kafka
RUN mv start.sh kafka
RUN chmod +x /app/kafka/start.sh

EXPOSE 9092

CMD ["sh","/app/kafka/start.sh"]