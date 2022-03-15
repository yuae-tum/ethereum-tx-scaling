import {Component, Input, OnInit} from '@angular/core';
import {TxData} from '../../model/TxData';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EthereumService} from '../../services/ethereum.service';
import {TxPool} from '../../model/TxPool';

@Component({
    selector: 'app-approach3',
    templateUrl: './approach3.component.html',
    styleUrls: ['./approach3.component.scss']
})
export class Approach3Component implements OnInit {

    numberMachines = 1;
    machines: MachineData[] = [];

    @Input()
    results = new Map<string, TxData>();

    @Input()
    txPoolStatus: TxPool[];

    constructor(private http: HttpClient,
                private snackBar: MatSnackBar,
                private etherService: EthereumService) { }

    ngOnInit(): void {
        this.updateMachines();
    }

    /**
     * adds or removes control panels for the transaction-creating machines to match the value of numberMachines
     */
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

    /**
     * updates the base URL for a transaction-creating machine, checks if the URL is valid by requesting the node version
     * from the machine. If the URL is valid, then this function also fetches the ID and the configured Ethereum account
     * and Smart Contract address from the machine.
     * @param machine the machine whose base URL should be updated
     * @param url the new base URL
     */
    setBaseUrl(machine: MachineData, url: string): void {
        this.http.get(url + '/node-version', { responseType: 'text' }).subscribe(response => {
            console.log(response);
            machine.url = url;
            console.log('geth node version: ' + response);
            this.snackBar.open('Connection successful');
            this.getCurrentAccount(machine);
            this.getCurrentContractAddress(machine);
            this.getMachineId(machine);
        }, error => {
            console.log(error);
            this.snackBar.open('Connection failed');
        });
    }

    /**
     * fetches the ID of a transaction-creating machine
     * @param machine the machine whose ID is fetched
     */
    getMachineId(machine: MachineData): void {
        this.http.get(machine.url + '/machineId', { responseType: 'text' }).subscribe(response => {
            machine.machineId = response;
        }, error => {
            console.log(error);
            this.snackBar.open('Error while fetching machine id');
        });
    }

    /**
     * Causes a transaction-creating machine to fetch the current nonce from the Ethereum network and update the value
     * at the Nonce Manager accordingly. Also returns the current nonce.
     * @param machine the transaction-creating machine
     */
    synchronizeNonce(machine: MachineData): void {
        this.http.get<number>(machine.url + '/sync-nonce').subscribe(response => {
            console.log('nonce: ' + response);
            this.snackBar.open('synchronized nonce, currently at ' + response);
        }, error => {
            console.log(error);
            this.snackBar.open('error while synchronizing nonce');
        });
    }

    /**
     * fetches the configured Ethereum account from a transaction-creating machine
     * @param machine the machine to fetch the configured account from
     */
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

    /**
     * overwrites the Ethereum account that the transaction-creating machine uses to create transactions
     * @param machine the respective transaction-creating machine
     * @param privateKey the account's private key
     */
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

    /**
     * fetches the configured address of the Smart Contract from a transaction-creating machine
     * @param machine the machine to fetch the address from
     */
    getCurrentContractAddress(machine: MachineData): void {
        this.http.get(machine.url + '/contract', { responseType: 'text' }).subscribe(response => {
            machine.contractAddress = response;
        }, error => {
            console.log(error);
            this.snackBar.open('Error while fetching contract address');
        });
    }

    /**
     * overwrites the configured address of the Smart Contract on a transaction-creating machine
     * @param machine the respective transaction-creating machine
     * @param contractAddress the new address
     */
    setContractAddress(machine: MachineData, contractAddress: string): void {
        this.http.post(machine.url + '/contract', contractAddress, { responseType: 'text' }).subscribe(response => {
            machine.contractAddress = response;
        }, error => {
            console.log(error);
            this.snackBar.open('Error while setting contract address');
        });
    }

    /**
     * causes a transaction-creating machine to continuously create transactions
     * @param machine the respective machine
     */
    startTxCreation(machine: MachineData): void {
        this.http.get(machine.url + '/start-tx-creation').subscribe(() => {
            machine.isRunning = true;
            this.snackBar.open('Started TX creation on Machine ' + (machine.index + 1));
        }, error => {
            console.log(error);
            this.snackBar.open('Error while starting TX creation on Machine ' + (machine.index + 1));
        });
    }

    /**
     * stops a transaction-creating machine from creating transactions
     * @param machine the respective machine
     */
    stopTxCreation(machine: MachineData): void {
        this.http.get(machine.url + '/stop-tx-creation').subscribe(() => {
            machine.isRunning = false;
            this.snackBar.open('Stopped TX creation on Machine ' + (machine.index + 1));
        }, error => {
            console.log(error);
            this.snackBar.open('Error while stopping TX creation on Machine ' + (machine.index + 1));
        });
    }

    /**
     * fetches recorded information about the created transactions from a transaction-creating machine and merges
     * it with the information obtained by the block listener
     * @param machine the respective machine
     */
    fetchResults(machine: MachineData): void {
        this.etherService.fetchResults(machine.url + '/receipts', this.results);
    }

    /**
     * starts transaction creation on all known transaction-creating machines
     */
    startAllMachines(): void {
        if (this.machines.some(machine => machine.url == null)) {
            this.snackBar.open('Failed, set base URL for every machine');
        } else {
            this.machines.forEach(machine => this.startTxCreation(machine));
        }
    }

    /**
     * stops transaction creation on all known transaction-creating machines
     */
    stopAllMachines(): void {
        this.machines.forEach(machine => this.stopTxCreation(machine));
    }

    /**
     * fetches recorded information about the created transactions from all transaction-creating machines and merges
     * it with the information obtained by the block listener
     */
    fetchAllResults(): void {
        this.machines.forEach(machine => this.fetchResults(machine));
    }

    /**
     * writes data about the created transactions and the transaction pool to a json file, which is then downloaded
     */
    downloadResultsAsJsonFile(): void {
        const content = {
            txData: [...this.results.values()],
            miningNodeData: this.txPoolStatus
        };
        this.etherService.downloadResults(content);
    }

}

class MachineData {
    index: number;
    machineId: string;
    url: string;
    isRunning = false;
    privateKey: string;
    publicKey: string;
    accountAddress: string;
    contractAddress: string;
}
