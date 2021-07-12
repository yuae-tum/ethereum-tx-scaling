**only tested for Windows

Requirements

* install node and npm: https://nodejs.org/en/
* install truffle: npm install -g truffle
* install docker/docker-compose: https://docs.docker.com/docker-for-windows/install/
* install git: https://git-scm.com/downloads
* create a directory and clone the repository: "git clone https://gitlab.tubit.tu-berlin.de/imweber/eth-tx-scaling.git"

How to Use

1. run "docker-compose up --build -d"
   
    wait until every container is booted and geth nodes are connected (~ 30-60 seconds)

2. execute unlock-accounts-and-start-miner.bat (for linux just copy-past each line of the .bat file and
   execute them in a terminal one after another)
   
    wait 30-60 seconds again, until mining process has started and new blocks are sent to all nodes

3. cd into ./truffle and run "truffle migrate"

   wait for migration to finish

4. open a browser and go to "localhost:4200"

   below the chart is the "start recording" - button. After pressing the button, the application will
   listen for pending requests on the ethereum network and update the chart accordingly. Below you can see 9 pre-deposited 
   accounts, which each will create 5 tx/sec if you press its "Start Loop"-button. You can also add more accounts 
   by submitting their private key.
   
The application is pre-configured so that by default you can test the strategy with multiple user accounts where transactions are
created at the user client. If you want to use the strategy with only a single account where transactions
are created in the middleware, you have to first update the stored account address in the Smart Contract "BusinessContract":

cd into ./truffle
truffle console
let business = await BusinessContract.deployed()
business.setAccount('0x897dC876771D55FB5e5Fa237B66065f51a8A8FB6')

Otherwise, the transactions will fail because the sender account is not authorized.Afterwards, 
you can navigate to "Strategy 1: single account" in the frontend and press the 
"Start transaction creation"-button. To go back to using the other strategy again, 
do the following:

let auth = await AuthContract.deployed()
business.setAccount(auth.address)

Stop the application with the command: "docker-compose down -v". If you want to reset the
blockchain, delete the directories ./geth/gethdata/geth1/geth, ./geth/gethdata/geth2/geth
and ./geth/gethdata/geth3/geth