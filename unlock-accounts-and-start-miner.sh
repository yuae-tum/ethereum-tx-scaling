#!/bin/sh

if [ "$#" -ne 1 ]; then
    echo "error: specify container id"
    exit 1
fi

docker exec $1 geth --exec 'loadScript("/unlock-accounts.js")' attach ipc:/geth/geth.ipc
docker exec $1 geth --exec 'loadScript("/start-mining.js")' attach ipc:/geth/geth.ipc
docker exec $1 sh -c "cd /truffle && truffle deploy"