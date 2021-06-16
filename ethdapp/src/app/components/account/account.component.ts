import {Component, Input, OnInit} from '@angular/core';
import {ethers} from "ethers";
import authContract from "../../../../../truffle/build/contracts/AuthContract.json";

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

    @Input() account: ethers.Wallet;
    @Input() contractAddress: string;

    contract: ethers.Contract;
    nonce: number = 0;

    txSuccessfull = 0;
    txAll = 0;

    loop = false;

    constructor() {
    }

    ngOnInit(): void {
      this.getCurrentNonce();
      this.getContract();
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

    sendTransaction() {
        if(this.loop) {
            setTimeout(async () => {
                this.sendTransaction();
                this.txAll++;
                const txResponse: ethers.providers.TransactionResponse = await this.contract.forwardTransaction({
                    nonce: this.nonce++,
                    gasLimit: 99999,
                    gasPrice: 100000000
                });
                console.log('new transaction nonce: ' + txResponse.nonce)
                const txReceipt = await txResponse.wait();
                console.log('transaction receipt status: ' + txReceipt.status);
                this.txSuccessfull++;
            }, 1500)
        }
    }

}
