FROM ethereum/client-go:alltools-release-1.10

COPY docker-container-files/* /
COPY keystore/* /geth/keystore/
COPY truffle /truffle

RUN chmod a+x /startup.sh

RUN apk add --update --no-cache npm python3 make gcc libc-dev g++
RUN npm install -g truffle

ENTRYPOINT sh startup.sh
CMD "--port 30303 --http.port 8545 --ws.port 8645"