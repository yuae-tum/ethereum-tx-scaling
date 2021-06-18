const express = require('express');
const app = express();
const ethers = require('ethers');
const contractFile = require('./contracts/AuthContract.json');

const accountKey = '0xbcc6d4aa1e277f085b3e11f2c1e6f14dd04e8108c823898e06fa5287c2bf1a92';
const contractAddress = '0xF3B6f0Ac5B976aC0bb37dB749d1d6EAeB7df9F58';

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

app.listen(8085, '0.0.0.0', () => console.log((new Date).toLocaleTimeString() + 'listening on http://localhost:8085'));




///// INITIALIZATION //////

function getProvider(url) {
    return new ethers.providers.JsonRpcProvider(url)
}

function getContract(signer) {
    const contractStub = new ethers.Contract(contractAddress, contractFile.abi, signer);
    contractStub.deployed().then(result => contract = result).catch(error => {
        console.log((new Date).toLocaleTimeString() + 'error while fetching contract: ' + error);
        console.log('retrying in 10 seconds');
        setTimeout(() => getContract(signer), 10000);
    });
}

function getWallet(provider) {
    const wallet = new ethers.Wallet(accountKey, provider);
    wallet.getAddress().then(response => {
        console.log((new Date).toLocaleTimeString() + 'using account with address: ' + response + ', private key: ' + accountKey);
    }).catch(() => {
        console.log((new Date).toLocaleTimeString() + 'error while fetching account address, retrying in 10 seconds');
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
    setTimeout(() => {
        if(shouldLoop) loopTransaction();
        sendTransaction();
    }, 50)
}

function sendTransaction() {
    console.log('new request');
    contract.forwardTransaction({
        nonce: nonce++,
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
        console.log((new Date).toLocaleTimeString() + '- error: ' + error);
        transactionsFailed++;
    });
}