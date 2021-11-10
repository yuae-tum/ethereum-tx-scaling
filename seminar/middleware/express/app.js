const express = require('express');
const app = express();
const ethers = require('ethers');
const contractFile = require('./contracts/BusinessContract.json');

const accountKey = '0xbcc6d4aa1e277f085b3e11f2c1e6f14dd04e8108c823898e06fa5287c2bf1a92';
const contractAddress = '0x17cB057648a03dE335c773C7F6b7719c63A32eB7';

const provider = getProvider('http://load-balancer:8080');
const account = getWallet(provider);
let contract;
getContract(account);

let transactionsCreated = 0;
let transactionsSucceeded = 0;
let transactionsFailed = 0;

let nonce = 0;
getInitialNonce(account);



///// HTTP ENDPOINTS /////

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

app.get('/new-transaction', (req, res) => {
    sendTransaction();
    res.send('created new transaction: nonce=' + nonce + ', from=' + account.address + ', to: ' + contract.address);
});

let shouldLoop = false;
app.get('/transaction-loop', (req, res) => {
    shouldLoop = !shouldLoop;
    if(shouldLoop) {
        getInitialNonceAndStartLooping();
        res.send({
            msg: 'looping transactions: from=' + account.address + ', to: ' + contract.address,
            isLooping: true
        });
    } else {
        res.send({
            msg: 'stopped transaction loop',
            isLooping: false
        });
    }

});

app.get('/status', (req, res) => {
    res.send({
        currentNonce: nonce,
        transactionsCreated,
        transactionsSucceeded,
        transactionsFailed
    })
})

app.listen(8085, '0.0.0.0', () => console.log((new Date).toLocaleTimeString() + ' - listening on http://localhost:8085'));




///// INITIALIZATION //////

function getProvider(url) {
    return ethers.providers.getDefaultProvider(url);
}

function getContract(signer) {
    const contractStub = new ethers.Contract(contractAddress, contractFile.abi, signer);
    contractStub.deployed().then(result => {
        contract = result;
        console.log((new Date).toLocaleTimeString() + ' - added contract: ' + result.address);
    }).catch(error => {
        console.log((new Date).toLocaleTimeString() + ' - error while fetching contract: ' + error);
        console.log('retrying in 10 seconds');
        setTimeout(() => getContract(signer), 10000);
    });
}

function getWallet(provider) {
    const wallet = new ethers.Wallet(accountKey, provider);
    wallet.getAddress().then(response => {
        console.log((new Date).toLocaleTimeString() + ' - using account with address: ' + response + ', private key: ' + accountKey);
    }).catch(() => {
        console.log((new Date).toLocaleTimeString() + ' - error while fetching account address, retrying in 10 seconds');
        setTimeout(() => getWallet(provider), 10000);
    });
    return wallet;
}

function getInitialNonce() {
    account.getTransactionCount().then(number => {
        console.log((new Date).toLocaleTimeString() + ' - get initial nonce: ' + number);
        nonce = number;
    }).catch(error => {
        console.log((new Date).toLocaleTimeString() + ' - error while fetching nonce: ' + error);
        console.log('retrying in 10 seconds');
        setTimeout(() => getInitialNonce(account), 10000)
    });
}


////// SENDING TRANSACTIONS ///////

function getInitialNonceAndStartLooping() {
    account.getTransactionCount().then(number => {
        console.log((new Date).toLocaleTimeString() + ' - get initial nonce: ' + number);
        nonce = number;
        loopTransaction();
    }).catch(error => {
        console.log((new Date).toLocaleTimeString() + ' - error while fetching nonce: ' + error);
        console.log('retrying in 10 seconds');
        setTimeout(() => getInitialNonce(account), 10000)
    });
}

function loopTransaction() {
    let interval = setInterval(() => {
        if(shouldLoop) {
            sendTransaction();
        } else {
            clearInterval(interval);
        }
    }, 40)
}

function sendTransaction() {
    const currentNonce = nonce++;
    contract.processTransaction({
        nonce: currentNonce,
        gasLimit: 99999,
        gasPrice: 100
    }).then(txResponse => {
        transactionsCreated++;
        return txResponse.wait()
    }).then(receipt => {
        if(receipt.status === 1) {
            transactionsSucceeded++;
        }
    }).catch(error => {
        console.log((new Date).toLocaleTimeString() + ' - transaction error: ' + error);
        transactionsFailed++;
    });
}