import {Component, Input, OnInit} from '@angular/core';
import {ethers} from "ethers";
import authContract from "../../../../contracts/AuthContract.json";

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

    @Input() account: ethers.Wallet;
    contractAddress = '0xF3B6f0Ac5B976aC0bb37dB749d1d6EAeB7df9F58';

    contract: ethers.Contract;
    nonce = 0;
    balance = '';

    txSuccessfull = 0;
    txFailed = 0;
    txAll = 0;

    loop = false;

    constructor() {
    }

    ngOnInit(): void {
      this.getCurrentNonce();
      this.getContract();
      this.watchBalance();
    }

    getCurrentNonce() {
        this.account.getTransactionCount().then(number => {
          console.log('get initial nonce: ' + number)
          this.nonce = number
        });
    }

    getContract() {
        console.log("fetching contract with address: " + this.contractAddress)
        const contractStub = new ethers.Contract(this.contractAddress, authContract.abi, this.account);
        contractStub.deployed().then(response => {
            console.log('new contract: ');
            console.log(response);
            this.contract = response;
        });
    }

    watchBalance() {
        setInterval(() => {
            this.account.getBalance().then(number => this.balance = ethers.utils.formatEther(number))
        }, 10000)
    }

    sendTransactions() {
        if(this.loop) {
            setTimeout(async () => {
                this.sendTransactions();
                this.txAll++;
                const txResponse: ethers.providers.TransactionResponse = await this.contract.forwardTransaction({
                    nonce: this.nonce++,
                    gasLimit: 99999,
                    gasPrice: 10000
                });
                console.log('new transaction nonce: ' + txResponse.nonce)
                txResponse.wait().then(receipt => {
                    if(receipt.status === 1) {
                        this.txSuccessfull++;
                    } else {
                        this.txFailed++;
                    }
                }).catch(() => this.txFailed++);

            }, 500)
        }
    }

}
