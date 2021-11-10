FROM ethereum/client-go:alltools-stable

COPY docker-container-files/* /

RUN mv /startup.sh /usr/local/bin/startup.sh
RUN chmod a+x /usr/local/bin/startup.sh

ENTRYPOINT startup.sh
CMD "--port 30303 --http.port 8545 --ws.port 8645"