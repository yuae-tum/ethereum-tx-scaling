import {Component, Input, OnInit} from '@angular/core';
import {TxData} from '../../model/TxData';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EthereumService} from '../../services/ethereum.service';
import {TxPool} from "../../model/TxPool";

@Component({
    selector: 'app-approach4',
    templateUrl: './approach4.component.html',
    styleUrls: ['./approach4.component.scss']
})
export class Approach4Component implements OnInit {

    numberMachines = 1;
    machines: MachineData[] = [];

    @Input()
    results = new Map<string, TxData>();

    @Input()
    txPoolStatus: TxPool[];

    waitingTimeDistributionXAxes: string[] = [];
    waitingTimeDistributionYAxes: number[] = [];

    constructor(private http: HttpClient,
                private snackBar: MatSnackBar,
                private etherService: EthereumService) { }

    ngOnInit(): void {
        this.updateMachines();
    }


    updateMachines(): void {
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

    setBaseUrl(machine: MachineData, url: string): void {
        this.http.get(url + '/node-version', { responseType: 'text' }).subscribe(response => {
            console.log(response);
            machine.url = url;
            console.log('geth node version: ' + response);
            this.snackBar.open('Connection successful');
            this.getCurrentAccount(machine);
            this.getCurrentContractAddress(machine);
            this.getMachineId(machine);
            this.getContingentSize(machine);
        }, error => {
            console.log(error);
            this.snackBar.open('Connection failed');
        });
    }

    getMachineId(machine: MachineData): void {
        this.http.get(machine.url + '/machineId', { responseType: 'text' }).subscribe(response => {
            machine.machineId = response;
        }, error => {
            console.log(error);
            this.snackBar.open('Error while fetching machine id');
        });
    }

    synchronizeNonce(machine: MachineData): void {
        this.http.get<number>(machine.url + '/sync-nonce').subscribe(response => {
            console.log('nonce: ' + response);
            this.snackBar.open('synchronized nonce, currently at ' + response);
        }, error => {
            console.log(error);
            this.snackBar.open('error while synchronizing nonce');
        });
    }

    getCurrentAccount(machine: MachineData): void {
        this.http.get<any>(machine.url + '/account').subscribe(response => {
            machine.accountAddress = response.address;
            machine.publicKey = response.publicKey;
            machine.privateKey = response.privateKey;
        }, error => {
            console.log(error);
            this.snackBar.open('Error while fetching Account');
        });
    }

    setAccount(machine: MachineData, privateKey: string): void {
        this.http.post<any>(machine.url + '/account', privateKey).subscribe(response => {
            machine.accountAddress = response.address;
            machine.publicKey = response.publicKey;
            machine.privateKey = response.privateKey;
        }, error => {
            console.log(error);
            this.snackBar.open('Error while setting Account');
        });
    }

    getCurrentContractAddress(machine: MachineData): void {
        this.http.get(machine.url + '/contract', { responseType: 'text' }).subscribe(response => {
            machine.contractAddress = response;
        }, error => {
            console.log(error);
            this.snackBar.open('Error while fetching contract address');
        });
    }

    setContractAddress(machine: MachineData, contractAddress: string): void {
        this.http.post(machine.url + '/contract', contractAddress, { responseType: 'text' }).subscribe(response => {
            machine.contractAddress = response;
        }, error => {
            console.log(error);
            this.snackBar.open('Error while setting contract address');
        });
    }

    getContingentSize(machine: MachineData): void {
        this.http.get<number>(machine.url + '/contingent-size').subscribe(response => {
            machine.contingentSize = response;
        }, error => {
            console.log(error);
            this.snackBar.open('Error while fetching nonce contingent size');
        });
    }

    setContingentSize(machine: MachineData, size: string): void {
        this.http.post<number>(machine.url + '/contingent-size', parseInt(size, 10)).subscribe(response => {
            machine.contingentSize = response;
        }, error => {
            console.log(error);
            this.snackBar.open('Error while setting nonce contingent size');
        });
    }

    startTxCreation(machine: MachineData): void {
        this.http.get(machine.url + '/start-tx-creation').subscribe(() => {
            machine.isRunning = true;
            this.snackBar.open('Started transaction creation');
        }, error => {
            console.log(error);
            this.snackBar.open('Error while starting transaction creation');
        });
    }

    stopTxCreation(machine: MachineData): void {
        this.http.get(machine.url + '/stop-tx-creation').subscribe(() => {
            machine.isRunning = false;
            this.snackBar.open('Stopped transaction creation');
        }, error => {
            console.log(error);
            this.snackBar.open('Error while stopping transaction creation');
        });
    }

    fetchResults(machine: MachineData): void {
        this.etherService.fetchResults(machine.url + '/receipts', this.results);
    }

    startAllMachines(): void {
        if (this.machines.some(machine => machine.url == null)) {
            this.snackBar.open('Failed, set base URL for every machine');
        } else {
            this.machines.forEach(machine => this.startTxCreation(machine));
        }
    }

    stopAllMachines(): void {
        this.machines.forEach(machine => this.stopTxCreation(machine));
    }

    fetchAllResults(): void {
        this.machines.forEach(machine => this.fetchResults(machine));
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

    updateCharts(): void {
        /*const waitingTimes = this.results.filter(tx => tx.succeeded).map(tx => Math.round(tx.waitingTime / 1000) * 1000);
        const distribution: Map<number, number> = new Map<number, number>();
        waitingTimes.forEach(time => {
            const amount = distribution.get(time);
            distribution.set(time, amount == null ? 1 : amount + 1);
        });
        this.waitingTimeDistributionXAxes = Array.from(distribution.keys()).map(String);
        this.waitingTimeDistributionYAxes = Array.from(distribution.values());*/
    }

}

class MachineData {
    index: number;
    machineId: string;
    url: string;
    isRunning = false;
    contingentSize: number;
    privateKey: string;
    publicKey: string;
    accountAddress: string;
    contractAddress: string;
}
