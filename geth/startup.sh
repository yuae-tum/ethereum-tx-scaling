#!/bin/sh

if [ ! -d "/geth/geth" ]; then
    echo "empty, running 'geth init'..."
    geth init --datadir /geth /genesis.json
    echo "...done!"
fi

echo "~~~~~ STARTING GETH NODE ~~~~~~~"

geth --datadir /geth --ipcpath geth.ipc --nodekey /geth/geth.key \
--http --http.api "eth,net,web3,personal,admin,debug,txpool,clique,miner" --http.addr "0.0.0.0" --http.rpcprefix "/" --http.corsdomain "*" --http.vhosts "*" \
--allow-insecure-unlock --networkid "42" --miner.gasprice 1 --verbosity 3 --maxpeers 2 "$@"