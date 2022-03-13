import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TxData} from '../../model/TxData';
import {EthereumService} from '../../services/ethereum.service';
import {TxPool} from '../../model/TxPool';

@Component({
    selector: 'app-approach1',
    templateUrl: './approach1.component.html',
    styleUrls: ['./approach1.component.scss']
})
export class Approach1Component implements OnInit {

    numberMachines = 1;
    machines: MachineData[] = [];
    middleware = new Middleware();

    @Input()
    results = new Map<string, TxData>();

    @Input()
    txPoolStatus: TxPool[];

    constructor(private http: HttpClient,
                private snackbar: MatSnackBar,
                private etherService: EthereumService) { }

    ngOnInit(): void {
        this.updateNumberOfMachines();
    }

    setBaseUrlMiddleware(url: string): void {
        this.http.get(url + '/node-version', { responseType: 'text' }).subscribe(response => {
            this.middleware.url = url;
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
        this.http.get<any>(this.middleware.url + '/account').subscribe(response => {
            this.middleware.accountAddress = response.address;
            this.middleware.publicKey = response.publicKey;
            this.middleware.privateKey = response.privateKey;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while fetching Account');
        });
    }

    setAccount(privateKey: string): void {
        this.http.post<any>(this.middleware.url + '/account', privateKey).subscribe(response => {
            this.middleware.accountAddress = response.address;
            this.middleware.publicKey = response.publicKey;
            this.middleware.privateKey = response.privateKey;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while setting Account');
        });
    }

    getCurrentContractAddress(): void {
        this.http.get(this.middleware.url + '/contract', { responseType: 'text' }).subscribe(response => {
            this.middleware.contractAddress = response;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while fetching contract address');
        });
    }

    setContractAddress(contractAddress: string): void {
        this.http.post(this.middleware.url + '/contract', contractAddress, { responseType: 'text' }).subscribe(response => {
            this.middleware.contractAddress = response;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while setting contract address');
        });
    }

    updateNumberOfMachines(): void {
        // tslint:disable-next-line:triple-equals
        if (this.numberMachines == undefined || this.numberMachines < 0) {
            return;
        }
        while (this.machines.length !== this.numberMachines) {
            if (this.machines.length < this.numberMachines) {
                const machine = new MachineData();
                machine.index = this.machines.length;
                this.machines.push(machine);
            } else {
                this.machines.pop();
            }
        }
    }

    setBaseUrlTxCreatingMachine(machine: MachineData, url: string): void {
        machine.url = url;
        this.getTxCreatingMachineId(machine);
        this.getMiddlewareUrl(machine);
    }

    getTxCreatingMachineId(machine: MachineData): void {
        this.http.get(machine.url + '/machineId', { responseType: 'text' }).subscribe(response => {
            machine.machineId = response;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while fetching machine id');
        });
    }

    getMiddlewareUrl(machine: MachineData): void {
        this.http.get(machine.url + '/middlewareUrl', {responseType: 'text'}).subscribe(response => {
            machine.middlewareUrl = response;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while fetching url');
        });
    }

    setMiddlewareUrl(machine: MachineData, url: string): void {
        this.http.post(machine.url + '/middlewareUrl', url, {responseType: 'text'}).subscribe(response => {
            machine.middlewareUrl = response;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while updating url');
        });
    }

    startTxCreation(machine: MachineData): void {
        this.http.get<void>(machine.url + '/start-tx-creation').subscribe(reponse => {
            machine.isRunning = true;
            this.snackbar.open('Started TX creation on Machine ' + (machine.index + 1));
        }, error => {
            console.log(error);
            this.snackbar.open('Error while starting TX creation on Machine ' + (machine.index + 1));
        });
    }

    stopTxCreation(machine: MachineData): void {
        this.http.get<void>(machine.url + '/stop-tx-creation').subscribe(reponse => {
            machine.isRunning = false;
            this.snackbar.open('Stopped TX creation on Machine ' + (machine.index + 1));
        }, error => {
            console.log(error);
            this.snackbar.open('Error while stopping TX creation on Machine ' + (machine.index + 1));
        });
    }

    startAllMachines(): void {
        this.machines.forEach(machine => this.startTxCreation(machine));
    }

    stopAllMachines(): void {
        this.machines.forEach(machine => this.stopTxCreation(machine));
    }

    fetchResults(): void {
        this.etherService.fetchResults(this.middleware.url + '/receipts', this.results);
    }

    downloadResultsAsJsonFile(): void {
        const content = {
            txData: [...this.results.values()],
            miningNodeData: this.txPoolStatus
        };
        const sJson = JSON.stringify(content);
        const element = document.createElement('a');
        element.style.display = 'none';
        element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson));
        element.setAttribute('download', 'result.json');
        document.body.appendChild(element);
        element.click(); // simulate click
        document.body.removeChild(element);
        console.log(this.txPoolStatus);
        console.log([...this.results.values()]);
    }

}

class MachineData {
    index: number;
    machineId: string;
    url: string;
    middlewareUrl: string;
    isRunning = false;
}

class Middleware {
    url: string;
    privateKey: string;
    publicKey: string;
    accountAddress: string;
    contractAddress: string;
}
