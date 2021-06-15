import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ethers} from "ethers";

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnChanges {

    @Input() contractReadOnly: ethers.Contract;
    @Input() account: ethers.Wallet;

    contract: ethers.Contract;
    nonce: number = 0;

    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    txSuccessfull = 0;
    txAll = 0;

    loop = false;

    constructor() {
    }

    ngOnInit(): void {
        this.getCurrentNonce();
    }

    ngOnChanges(): void {
        this.contract = this.contractReadOnly.connect(this.account);
    }

    getCurrentNonce() {
        this.account.getTransactionCount().then(number => this.nonce = number);
    }

    sendTransaction() {
        if(this.loop) {
            setTimeout(async () => {
                this.sendTransaction();
                this.txAll++;
                const text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
                const txResponse: ethers.providers.TransactionResponse = await this.contract.functions.appendText(text, {
                    nonce: this.nonce++,
                    gasLimit: 99999999999999,
                    gasPrice: 20
                });
                console.log('new transaction nonce: ' + txResponse.nonce)
                const txReceipt = await txResponse.wait();
                console.log('transaction receipt status: ' + txReceipt.status);
                this.txSuccessfull++;
            }, 1500)
        }
    }

}
