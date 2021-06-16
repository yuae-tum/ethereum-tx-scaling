FROM ethereum/client-go:alltools-latest

COPY genesis.json /genesis.json
COPY startup.sh /startup.sh
COPY unlock-accounts.js /unlock-accounts.js
COPY start-mining.js /start-mining.js

RUN chmod a+x /startup.sh

EXPOSE 30301 30303 30304 30305 8545 8546 8547

ENTRYPOINT "geth --http --http.api 'db,eth,net,web3,personal' --http.corsdomain '*' --http.rpcprefix '/' --http.addr 0.0.0.0 --http.port 8545 --dev --dev.period 30 --datadir /geth --ipcpath geth.ipc --allow-insecure-unlock --networkid '42'"
