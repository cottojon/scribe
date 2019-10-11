FROM clearlinux

RUN swupd update
RUN swupd bundle-add java-runtime curl

WORKDIR /app
COPY start.sh /app

RUN curl http://mirror.metrocast.net/apache/kafka/2.3.0/kafka_2.12-2.3.0.tgz -o kafka.tgz
RUN tar -xvf kafka.tgz kafka_2.12-2.3.0/
RUN rm kafka.tgz
RUN mv kafka_2.12-2.3.0/* .
RUN chmod +x /app/start.sh
RUN swupd bundle-remove curl

EXPOSE 9092
CMD ["sh","/app/start.sh"]
