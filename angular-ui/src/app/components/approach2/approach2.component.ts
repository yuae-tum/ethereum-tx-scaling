import {Component, OnInit, Input} from '@angular/core';
import {ethers} from "ethers";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TxData} from "../../model/TxData";

@Component({
    selector: 'app-approach2',
    templateUrl: './approach2.component.html',
    styleUrls: ['./approach2.component.scss']
})
export class Approach2Component implements OnInit {

    @Input() provider: ethers.providers.WebSocketProvider;

    numberMachines = 1;
    machines: MachineData[] = [];

    results: TxData[] = [];
    waitingTimeDistributionXAxes: string[] = [];
    waitingTimeDistributionYAxes: number[] = [];

    constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

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
        // @ts-ignore
        this.http.get<string>(url + '/node-version', { responseType: 'text' }).subscribe(response => {
            console.log(response);
            machine.url = url;
            console.log('geth node version: ' + response);
            this.snackBar.open('Connection successful');
            this.getCurrentAccount(machine);
            this.getCurrentContractAddress(machine);
            this.getCurrentTxInterval(machine);
        }, error => {
            console.log(error);
            this.snackBar.open('Connection failed');
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
        // @ts-ignore
        this.http.get<string>(machine.url + '/contract', { responseType: 'text' }).subscribe(response => {
            // @ts-ignore
            machine.contractAddress = response;
        }, error => {
            console.log(error);
            this.snackBar.open('Error while fetching contract address');
        });
    }

    setContractAddress(machine: MachineData, contractAddress: string): void {
        this.http.post<string>(machine.url + '/contract', contractAddress).subscribe(response => {
            machine.contractAddress = response;
        }, error => {
            console.log(error);
            this.snackBar.open('Error while setting contract address');
        });
    }

    getCurrentTxInterval(machine: MachineData): void {
        this.http.get<number>(machine.url + '/tx-interval').subscribe(response => {
            machine.interval = response;
        }, error => {
            console.log(error);
            this.snackBar.open('Error while fetching tx interval');
        });
    }

    setTxInterval(machine: MachineData, interval: string): void {
        this.http.post<number>(machine.url + '/tx-interval', parseInt(interval, 10)).subscribe(response => {
            machine.interval = response;
        }, error => {
            console.log(error);
            this.snackBar.open('Error while fetching tx interval');
        });
    }

    startTxCreation(machine: MachineData): void {
        this.http.get<void>(machine.url + '/start-tx-creation').subscribe(() => {
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
        this.http.get<TxData[]>(machine.url + '/receipts').subscribe(response => {
            response.forEach(txData => txData.machineIndex = machine.index);
            this.results.push(...response);
        }, error => {
            console.log(error);
            this.snackBar.open('Error while fetching results');
        });
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
        console.log(this.results);
        console.log(this.waitingTimeDistributionXAxes);
        console.log(this.waitingTimeDistributionYAxes);
    }

    updateCharts(): void {
        const waitingTimes = this.results.filter(tx => tx.succeeded).map(tx => Math.round(tx.waitingTime / 1000) * 1000);
        const distribution: Map<number, number> = new Map<number, number>();
        waitingTimes.forEach(time => {
            const amount = distribution.get(time);
            distribution.set(time, amount == null ? 1 : amount + 1);
        });
        this.waitingTimeDistributionXAxes = Array.from(distribution.keys()).map(String);
        this.waitingTimeDistributionYAxes = Array.from(distribution.values());
    }

}

class MachineData {
    index: number;
    url: string;
    isRunning = false;
    interval: number;
    privateKey: string;
    publicKey: string;
    accountAddress: string;
    contractAddress: string;
}
