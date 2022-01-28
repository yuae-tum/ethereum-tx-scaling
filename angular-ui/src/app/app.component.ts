import {Component} from '@angular/core';
import {ethers} from 'ethers';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    title = 'angular-ui';

    nodeUrl = 'localhost:8546';
    provider: ethers.providers.WebSocketProvider;

    listenForBlocks = false;

    // maps tx hashes to block numbers and mining times
    transactionMap = new Map<string, [number, Date]>();

    constructor(private snackBar: MatSnackBar) {
    }

    connectToNode(): void {
        this.provider = new ethers.providers.WebSocketProvider('ws://' + this.nodeUrl);
        this.provider.ready.then(network => {
            this.snackBar.open('Connected to Node');
            console.log('Node: ' + this.nodeUrl + '; network name: ' + network.name + '; chainId: ' + network.chainId);
        }, error => {
            this.snackBar.open('Unable to connect');
            console.log('could not connect to node: ' + error);
            // @ts-ignore
            this.provider = undefined;
        });
    }

    toggleBlockListener(): void {
        if (this.listenForBlocks) {
            this.provider.off('block');
            this.listenForBlocks = false;
        } else {
            this.provider.on('block', (blocknumber: number) => {
                this.provider.getBlock(blocknumber).then(block => {
                    const blockNumberAndTimestamp: [number, Date] = [block.number, new Date(block.timestamp * 1000)];
                    block.transactions.forEach(txHash => {
                        this.transactionMap.set(txHash, blockNumberAndTimestamp);
                    });
                    console.log('new block ' + blocknumber + ' with ' + block.transactions.length + ' TXs');
                });
            });
            this.listenForBlocks = true;
        }
    }
}
