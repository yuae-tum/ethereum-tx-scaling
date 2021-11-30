import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-approach1',
    templateUrl: './approach1.component.html',
    styleUrls: ['./approach1.component.scss']
})
export class Approach1Component implements OnInit {

    numberRequestMachines = 1;
    requestMachines: RequestMachine[] = [];

    creatingMachine = new CreatingMachine();

    constructor(private http: HttpClient, private snackbar: MatSnackBar) { }

    ngOnInit(): void {
        this.updateRequestMachines();
    }

    setBaseUrlCreationMachine(url: string): void {
        // @ts-ignore
        this.http.get<string>(url + '/node-version', { responseType: 'text' }).subscribe(response => {
            console.log(response);
            this.creatingMachine.url = url;
            console.log('geth node version: ' + response);
            this.snackbar.open('Connection successful');
            this.getCurrentAccount();
            this.getCurrentContractAddress();
        }, error => {
            console.log(error);
            this.snackbar.open('Connection failed');
        });
    }

    getCurrentAccount(): void {
        this.http.get<any>(this.creatingMachine.url + '/account').subscribe(response => {
            this.creatingMachine.accountAddress = response.address;
            this.creatingMachine.publicKey = response.publicKey;
            this.creatingMachine.privateKey = response.privateKey;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while fetching Account');
        });
    }

    setAccount(privateKey: string): void {
        this.http.post<any>(this.creatingMachine.url + '/account', privateKey).subscribe(response => {
            this.creatingMachine.accountAddress = response.address;
            this.creatingMachine.publicKey = response.publicKey;
            this.creatingMachine.privateKey = response.privateKey;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while setting Account');
        });
    }

    getCurrentContractAddress(): void {
        // @ts-ignore
        this.http.get<string>(this.creatingMachine.url + '/contract', { responseType: 'text' }).subscribe(response => {
            // @ts-ignore
            this.creatingMachine.contractAddress = response;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while fetching contract address');
        });
    }

    setContractAddress(contractAddress: string): void {
        // @ts-ignore
        this.http.post<string>(this.creatingMachine.url + '/contract', contractAddress, { responseType: 'text' }).subscribe(response => {
            // @ts-ignore
            this.creatingMachine.contractAddress = response;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while setting contract address');
        });
    }

    updateRequestMachines(): void {
        // tslint:disable-next-line:triple-equals
        if (this.numberRequestMachines == undefined || this.numberRequestMachines < 0) {
            return;
        }
        while (this.requestMachines.length !== this.numberRequestMachines) {
            if (this.requestMachines.length < this.numberRequestMachines) {
                const machine = new RequestMachine();
                machine.index = this.requestMachines.length;
                this.requestMachines.push(machine);
            } else {
                this.requestMachines.pop();
            }
        }
    }

    setBaseUrlRequestingMachine(machine: RequestMachine, url: string): void {
        machine.url = url;
        this.getCurrentTxInterval(machine);
        this.getTxCreationMachineUrl(machine);
    }

    getCurrentTxInterval(machine: RequestMachine): void {
        this.http.get<number>(machine.url + '/tx-interval').subscribe(response => {
            machine.interval = response;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while fetching tx interval');
        });
    }

    setTxInterval(machine: RequestMachine, interval: string): void {
        this.http.post<number>(machine.url + '/tx-interval', parseInt(interval, 10)).subscribe(response => {
            machine.interval = response;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while fetching tx interval');
        });
    }

    getTxCreationMachineUrl(machine: RequestMachine): void {
        // @ts-ignore
        this.http.get<string>(machine.url + '/txCreationMachineUrl', {responseType: 'text'}).subscribe(response => {
            // @ts-ignore
            machine.txCreationUrl = response;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while fetching url');
        });
    }

    setTxCreationMachineUrl(machine: RequestMachine, url: string): void {
        // @ts-ignore
        this.http.post<string>(machine.url + '/txCreationMachineUrl', url, {responseType: 'text'}).subscribe(response => {
            // @ts-ignore
            machine.txCreationUrl = response;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while updating url')
        });
    }

    startTxRequesting(machine: RequestMachine): void {
        this.http.get<void>(machine.url + '/start-tx-creation').subscribe(reponse => {
            machine.isRunning = true;
            this.snackbar.open('Started TX Requesting on Machine ' + machine.index);
        }, error => {
            console.log(error);
            this.snackbar.open('Error while starting TX Requesting on Machine ' + machine.index);
        });
    }

    stopTxRequesting(machine: RequestMachine): void {
        this.http.get<void>(machine.url + '/stop-tx-creation').subscribe(reponse => {
            machine.isRunning = false;
            this.snackbar.open('Stopped TX Requesting on Machine ' + machine.index);
        }, error => {
            console.log(error);
            this.snackbar.open('Error while stopping TX Requesting on Machine ' + machine.index);
        });
    }

    startAllMachines(): void {
        this.requestMachines.forEach(machine => this.startTxRequesting(machine));
    }

    stopAllMachines(): void {
        this.requestMachines.forEach(machine => this.stopTxRequesting(machine));
    }

}

class RequestMachine {
    index: number;
    url: string;
    txCreationUrl: string;
    isRunning = false;
    interval: number;
}

class CreatingMachine {
    url: string;
    privateKey: string;
    publicKey: string;
    accountAddress: string;
    contractAddress: string;
}
