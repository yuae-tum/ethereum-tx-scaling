FROM ethereum/client-go:alltools-release-1.10

COPY docker-container-files/* /

#RUN mv /startup.sh /usr/local/bin/startup.sh
#RUN chmod a+x /usr/local/bin/startup.sh
RUN chmod a+x /startup.sh

ENTRYPOINT sh startup.sh
#ENTRYPOINT /startup.sh
CMD "--port 30303 --http.port 8545 --ws.port 8645"