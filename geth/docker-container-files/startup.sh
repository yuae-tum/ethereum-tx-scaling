#!/bin/sh

if [ ! -d "/geth/geth" ]; then
    echo "empty, running 'geth init'..."
    geth init --datadir /geth /genesis.json
    echo "...done!"
fi

echo "~~~~~ STARTING GETH NODE ~~~~~~~"

geth --datadir /geth --ipcpath geth.ipc --nodekey /geth.key \
--http --http.api "eth,net,web3,personal,admin,debug,txpool,clique,miner" --http.addr "0.0.0.0" --http.rpcprefix "/" --http.corsdomain "*" --http.vhosts "*" \
--ws --ws.api "eth,net,web3,personal,admin,debug,txpool,clique,miner" --ws.addr "0.0.0.0" --ws.rpcprefix "/" --ws.origins "*" \
--allow-insecure-unlock --networkid 98156 --miner.gasprice 1 --verbosity 3 --maxpeers 0 "$@"