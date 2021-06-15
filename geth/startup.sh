#!/bin/sh

echo "~~~~~ STARTING GETH NODE ~~~~~~~"

if [ ! -d "/geth/geth" ]; then
    echo "empty, running 'geth init'..."
    geth init --datadir /geth /genesis.json
    echo "...done!"
fi

geth --http --http.api 'db,eth,net,web3,personal' --http.addr '0.0.0.0' --datadir /geth --ipcpath geth.ipc \
--ws --ws.addr '0.0.0.0' \
--allow-insecure-unlock --networkid '42' --verbosity 5 \
--bootnodes "enode://08e74d9a2e23038dd0a2e046b539f847f8a9409919ea2c75c44714775b6b7818e9321fc6c01119a0f0d8409312eae97bf049a96b4b5854c23c1a42aabfe742ed@172.18.0.2:0?discport=30301" "$@"