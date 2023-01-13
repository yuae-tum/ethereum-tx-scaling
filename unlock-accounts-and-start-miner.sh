#!/bin/sh

if [ "$#" -ne 1 ]; then
    echo "error: specify container id"
    exit 1
fi

docker exec $1 geth attach /geth/geth.ipc --preload "/unlock-accounts.js,/start-mining.js"
docker exec $1 sh -c "cd /truffle && truffle deploy"