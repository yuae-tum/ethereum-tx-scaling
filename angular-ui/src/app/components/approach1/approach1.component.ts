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
        this.updateMachines();
    }

    /**
     * updates the base URL for the middleware, checks if the URL is valid by requesting the node version
     * from the middleware. If the URL is valid, then this function also fetches the configured Ethereum account
     * and Smart Contract address from the middleware.
     * @param url the new base URL
     */
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

    /**
     * fetches the configured Ethereum account from the middleware
     */
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

    /**
     * overwrites the Ethereum account that the middleware uses to create transactions
     * @param privateKey the account's private key
     */
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

    /**
     * fetches the configured address of the Smart Contract from the middleware
     */
    getCurrentContractAddress(): void {
        this.http.get(this.middleware.url + '/contract', { responseType: 'text' }).subscribe(response => {
            this.middleware.contractAddress = response;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while fetching contract address');
        });
    }

    /**
     * overwrites the configured address of the Smart Contract on the middleware
     * @param contractAddress the new address
     */
    setContractAddress(contractAddress: string): void {
        this.http.post(this.middleware.url + '/contract', contractAddress, { responseType: 'text' }).subscribe(response => {
            this.middleware.contractAddress = response;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while setting contract address');
        });
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
     * from the machine. If the URL is valid, then this function also fetches the ID and the configured URL to the
     * middleware from the machine.
     * @param machine the machine whose base URL should be updated
     * @param url the new base URL
     */
    setBaseUrlTxCreatingMachine(machine: MachineData, url: string): void {
        machine.url = url;
        this.getTxCreatingMachineId(machine);
        this.getMiddlewareUrl(machine);
    }

    /**
     * fetches the ID of a transaction-creating machine
     * @param machine the machine whose ID is fetched
     */
    getTxCreatingMachineId(machine: MachineData): void {
        this.http.get(machine.url + '/machineId', { responseType: 'text' }).subscribe(response => {
            machine.machineId = response;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while fetching machine id');
        });
    }

    /**
     * fetches the configured URL to the middleware from a transaction-creating machine
     * @param machine the machine to fetch the URL from
     */
    getMiddlewareUrl(machine: MachineData): void {
        this.http.get(machine.url + '/middlewareUrl', {responseType: 'text'}).subscribe(response => {
            machine.middlewareUrl = response;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while fetching url');
        });
    }

    /**
     * overwrites the configured URL to the middleware on a transaction-creating machine
     * @param machine the respective machine
     * @param url the new URL
     */
    setMiddlewareUrl(machine: MachineData, url: string): void {
        this.http.post(machine.url + '/middlewareUrl', url, {responseType: 'text'}).subscribe(response => {
            machine.middlewareUrl = response;
        }, error => {
            console.log(error);
            this.snackbar.open('Error while updating url');
        });
    }

    /**
     * causes a transaction-creating machine to continuously create transactions
     * @param machine the respective machine
     */
    startTxCreation(machine: MachineData): void {
        this.http.get<void>(machine.url + '/start-tx-creation').subscribe(reponse => {
            machine.isRunning = true;
            this.snackbar.open('Started TX creation on Machine ' + (machine.index + 1));
        }, error => {
            console.log(error);
            this.snackbar.open('Error while starting TX creation on Machine ' + (machine.index + 1));
        });
    }

    /**
     * stops a transaction-creating machine from creating transactions
     * @param machine the respective machine
     */
    stopTxCreation(machine: MachineData): void {
        this.http.get<void>(machine.url + '/stop-tx-creation').subscribe(reponse => {
            machine.isRunning = false;
            this.snackbar.open('Stopped TX creation on Machine ' + (machine.index + 1));
        }, error => {
            console.log(error);
            this.snackbar.open('Error while stopping TX creation on Machine ' + (machine.index + 1));
        });
    }

    /**
     * starts transaction creation on all known transaction-creating machines
     */
    startAllMachines(): void {
        this.machines.forEach(machine => this.startTxCreation(machine));
    }

    /**
     * stops transaction creation on all known transaction-creating machines
     */
    stopAllMachines(): void {
        this.machines.forEach(machine => this.stopTxCreation(machine));
    }

    /**
     * fetches recorded information about the created transactions from the middleware and merges
     * it with the information obtained by the block listener
     */
    fetchResults(): void {
        this.etherService.fetchResults(this.middleware.url + '/receipts', this.results);
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
