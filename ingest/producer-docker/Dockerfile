FROM clearlinux       

RUN swupd update
RUN swupd bundle-add python3-basic curl
RUN pip3 install kafka-python

WORKDIR /app
COPY producer.py /app

RUN curl https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz -o ffmpeg.tar.xz
RUN tar xf ffmpeg.tar.xz
RUN mv ffmpeg-4.2.1-amd64-static ffmpeg
RUN chmod +x ffmpeg/ff*
RUN cp ffmpeg/ff* /bin

CMD ["python3","producer.py"]