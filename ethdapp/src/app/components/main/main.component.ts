import { Component, OnInit } from '@angular/core';
import {ethers} from "ethers";
import {TranserService} from "../../services/transer-service";
import businessContract from "../../../../../truffle/build/contracts/BusinessContract.json";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    privateKey: string = '0x6c26fa36e5760ae52b5549ea7c1ff92b64bd1ccc5f1cf0cfa3f2693ff0cc9e66';
    authContractAddress: string = '0xF3B6f0Ac5B976aC0bb37dB749d1d6EAeB7df9F58';
    businessContractAddress: string = '0x17cB057648a03dE335c773C7F6b7719c63A32eB7';

    accounts: ethers.Wallet[] = [];
    businessContract: ethers.Contract;

    pendingTransactions: Map<string, ethers.Transaction> = new Map<string, ethers.Transaction>();
    totalCount = 0;
    errorCount = 0;
    successCount = 0;

    businessContractTransactionsReceived = 0;

    constructor(private etherService: TranserService) {
    }

    ngOnInit(): void {
        this.setupListenerForPendingRequests();
    }

    setupListenerForPendingRequests() {
        this.etherService.getProvider().on('pending', (tx: ethers.providers.TransactionResponse) => {
            this.pendingTransactions.set(tx.hash, tx);
            this.totalCount++;
            tx.wait()
                .then(()=>this.successCount++)
                .catch(()=>this.errorCount++)
                .finally(() => this.pendingTransactions.delete(tx.hash));
        })
    }

    getContract() {
        const contractStub = new ethers.Contract(this.businessContractAddress, businessContract.abi, this.etherService.getProvider());
        contractStub.deployed().then(response => {
            console.log('new contract: ');
            console.log(response);
            this.businessContract = response;
            setInterval(() => {
                this.businessContract.functions.txCounter().then((response: number) => this.businessContractTransactionsReceived = response);
            }, 10000)
        });
    }

    addNewAccount() {
        const key = this.privateKey;
        const account = new ethers.Wallet(key, this.etherService.getProvider());
        account.getAddress().then(response => {
            console.log('address: ' + response + ", private key: " + key);
            this.accounts.push(account);
        });
    }

}
