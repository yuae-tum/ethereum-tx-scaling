import { Component, OnInit } from '@angular/core';
import {ethers} from "ethers";
import {TranserService} from "../../services/transer-service";
import testcontract from "../../../../../truffle/build/contracts/SeminarContract.json";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    privateKey: string = '0x6c26fa36e5760ae52b5549ea7c1ff92b64bd1ccc5f1cf0cfa3f2693ff0cc9e66';
    contractAddress: string = '0x17cB057648a03dE335c773C7F6b7719c63A32eB7';

    accounts: ethers.Wallet[] = [];
    contract: ethers.Contract;

    pendingTransactions: Map<string, ethers.Transaction> = new Map<string, ethers.Transaction>();
    totalCount = 0;
    errorCount = 0;
    successCount = 0;

    currentText = '';

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
        const contractStub = new ethers.Contract(this.contractAddress, testcontract.abi, this.etherService.getProvider());
        contractStub.deployed().then(response => {
            console.log('new contract: ');
            console.log(response);
            this.contract = response;
            setInterval(() => {
                this.contract.functions.text().then((response: string) => this.currentText = response);
            }, 10000)
        });
    }

    addNewAccount() {
        const key = this.privateKey;
        const account = new ethers.Wallet(key, this.etherService.getProvider());
        account.getAddress().then(response => {
            this.contract.connect(account);
            console.log('address: ' + response + ", private key: " + key);
            this.accounts.push(account);
        });
    }

}
