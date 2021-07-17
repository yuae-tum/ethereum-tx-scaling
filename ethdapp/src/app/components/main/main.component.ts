import { Component, OnInit } from '@angular/core';
import {ethers} from "ethers";
import businessContract from "../../../../contracts/BusinessContract.json";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    //businessContractAddress: string = '0x17cB057648a03dE335c773C7F6b7719c63A32eB7';
    //businessContract: ethers.Contract;

    provider = new ethers.providers.JsonRpcProvider('http://localhost:8080');

    privateKey = '';
    accounts: ethers.Wallet[] = [];

    isLooping = false;

    constructor(private http: HttpClient, private snackbar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.initAccounts();
    }

    addNewAccount(key: string) {
        const account = new ethers.Wallet(key, this.provider);
        this.privateKey = '';
        account.getAddress().then(response => {
            console.log('address: ' + response + ", private key: " + key);
            this.accounts.push(account);
        });
    }

    initAccounts() {
        const keys = [
            "0x6c26fa36e5760ae52b5549ea7c1ff92b64bd1ccc5f1cf0cfa3f2693ff0cc9e66",
            "0x798cb1f9cec6aebf69b4e51a882d3feaca7db8d7fac25abaf654834f46894679",
            "0x27d851040a61d8d84e0635a64cae3f2ad3a0cc08e689ec455b4ec2ba82d84513",
            "0x40b3ae5d79a27f3dd2fa7a88f55190ef347f2f8e78a7bb3f58fe2340398ef1ce",
            "0xe1dd8c28883f0ac6d5924a7b3841d2d25c2dc75a5c54c9252c265363bab6c0b9",
            "0xc972474ff37b3f4c8883b7c73c8e9db78357720924551dab38d51601c4324e56",
            "0x5c3876a448b5eb7dcda19c91a1ae851c9fabbd88b4237b7514056448987bd3c5",
            "0xe1f522c01c7f52ae8e8ae48ed6d6e85b88207b1dcf83e9b8a9f25b6e674fd375",
            "0xbb93139a2c6bc1bdc37e55cb2c6e977cf717d3c7333c5a62a537969d6078fd37"
        ];
        keys.forEach(key => this.addNewAccount(key));
    }

    createTransactionsSingleAccount() {
        this.http.get<ExpressResponse>('http://localhost:8085/transaction-loop')
            .subscribe(response => {
                this.snackbar.open(response.msg);
                this.isLooping = response.isLooping;
            }, error => {
                this.snackbar.open('Something went wrong...');
                console.log(error);
            });
    }

    /*getContractBusinessContract() {
        const contractStub = new ethers.Contract(this.businessContractAddress, businessContract.abi, this.providerForListening);
        contractStub.deployed().then(response => {
            console.log('new contract: ');
            console.log(response);
            this.businessContract = response;
            setInterval(() => {
                this.businessContract.functions.txCounter().then((response: number) => this.businessContractTransactionsReceived = response);
            }, 10000)
        });
    }*/

}

interface ExpressResponse {
    msg: string;
    isLooping: boolean;
}
