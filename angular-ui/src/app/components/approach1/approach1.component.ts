import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TxData} from '../../model/TxData';
import {EthereumService} from '../../services/ethereum.service';
import {TxPool} from "../../model/TxPool";

@Component({
    selector: 'app-approach1',
    templateUrl: './approach1.component.html',
    styleUrls: ['./approach1.component.scss']
})
export class Approach1Component implements OnInit {

    numberRequestMachines = 1;
    requestMachines: RequestMachine[] = [];
    creatingMachine = new CreatingMachine();

    @Input()
    results = new Map<string, TxData>();

    @Input()
    txPoolStatus: TxPool[];

    constructor(private http: HttpClient,
                private snackbar: MatSnackBar,
                private etherService: EthereumService) { }

    ngOnInit(): void {
        this.updateRequestMachines();
    }

    setBaseUrlCreationMachine(url: string): void {
        this.http.get(url + '/node-version', { responseType: 'text' }).subscribe(response => {
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
        this.http.get(this.creatingMachine.url + '/contract', { responseType: 'text' }).subscribe(response => {
            this.creatingMachine.contractAddress = response;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while fetching contract address');
        });
    }

    setContractAddress(contractAddress: string): void {
        this.http.post(this.creatingMachine.url + '/contract', contractAddress, { responseType: 'text' }).subscribe(response => {
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
        this.getRequestingMachineId(machine);
        this.getTxCreationMachineUrl(machine);
    }

    getRequestingMachineId(machine: RequestMachine): void {
        this.http.get(machine.url + '/machineId', { responseType: 'text' }).subscribe(response => {
            machine.machineId = response;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while fetching machine id');
        });
    }

    getTxCreationMachineUrl(machine: RequestMachine): void {
        this.http.get(machine.url + '/txCreationMachineUrl', {responseType: 'text'}).subscribe(response => {
            machine.txCreationUrl = response;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while fetching url');
        });
    }

    setTxCreationMachineUrl(machine: RequestMachine, url: string): void {
        this.http.post(machine.url + '/txCreationMachineUrl', url, {responseType: 'text'}).subscribe(response => {
            machine.txCreationUrl = response;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while updating url');
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

    fetchResults(): void {
        this.etherService.fetchResults(this.creatingMachine.url + '/receipts', this.results);
    }

    downloadResultsAsJsonFile(): void {
        /*
        const sJson = JSON.stringify(this.results);
        const element = document.createElement('a');
        element.style.display = 'none';
        element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson));
        element.setAttribute('download', 'result.json');
        document.body.appendChild(element);
        element.click(); // simulate click
        document.body.removeChild(element);
        */
        console.log(this.txPoolStatus);
        console.log(this.results);
    }

}

class RequestMachine {
    index: number;
    machineId: string;
    url: string;
    txCreationUrl: string;
    isRunning = false;
}

class CreatingMachine {
    url: string;
    privateKey: string;
    publicKey: string;
    accountAddress: string;
    contractAddress: string;
}
