if "%1" == "" (
    echo "error: specify container id"
    exit /b 1
)

docker exec %1 geth attach /geth/geth.ipc --preload "/unlock-accounts.js,/start-mining.js"
docker exec %1 sh -c "cd /truffle && truffle deploy"