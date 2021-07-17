docker exec geth1 geth attach /geth/geth.ipc --preload "/unlock-accounts.js"
docker exec geth2 geth attach /geth/geth.ipc --preload "/unlock-accounts.js"
docker exec geth3 geth attach /geth/geth.ipc --preload "/unlock-accounts.js,/start-mining.js"