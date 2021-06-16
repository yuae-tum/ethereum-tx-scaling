const express = require('express');
const app = express();
const ethers = require('ethers');
const contractFile = require('../truffle/build/contracts/AuthContract.json');


const providers = getProviders();
const contract = await getContract(providers[0]);
const account = getWallet(providers[0]);

app.listen(8080, 'localhost', () => console.log('listener callback'));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get()

function getProviders() {
    let providers = [];
    providers.push(new ethers.providers.JsonRpcProvider('http://localhost:8545'));
    //providers.push(new ethers.providers.JsonRpcProvider('http://localhost:8546'));
    //providers.push(new ethers.providers.JsonRpcProvider('http://localhost:8547'));
    return providers;
}

async function getContract(provider) {
    const contractStub = new ethers.Contract(process.argv[1], contractFile.abi, provider);
    return await contractStub.deployed();
}

function getWallet(provider) {
    const wallet = new ethers.Wallet(process.argv[0], provider);
    wallet.getAddress().then(response => {
        console.log('using account with address: ' + response + ', private key: ' + process.argv[0])
    });
    return wallet;
}