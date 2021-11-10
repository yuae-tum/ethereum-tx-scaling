echo "~~~~~ START DEV MODE ~~~~~~~"

geth --http --http.api 'db,eth,net,web3,personal' --http.corsdomain '*' --http.rpcprefix '/' --http.addr 0.0.0.0 --http.port 8545 --dev --dev.period 30 --datadir /geth --ipcpath geth.ipc --allow-insecure-unlock --networkid '42'