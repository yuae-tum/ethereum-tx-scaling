import {Component} from '@angular/core';
import {ethers} from 'ethers';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TxData} from './model/TxData';
import {TxPool} from './model/TxPool';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    title = 'angular-ui';

    nodeAddress = 'localhost';
    provider: ethers.providers.WebSocketProvider;

    listenForBlocks = false;

    results = new Map<string, TxData>();
    txPoolStatus: TxPool[] = [];

    constructor(private snackBar: MatSnackBar) {
    }

    connectToNode(): void {
        this.provider = new ethers.providers.WebSocketProvider('ws://' + this.nodeAddress + ':8546');
        this.provider.ready.then(network => {
            this.snackBar.open('Connected to Node');
            console.log('Node: ' + this.nodeAddress + '; network name: ' + network.name + '; chainId: ' + network.chainId);
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
            this.txPoolStatus = [];
            this.listenForBlocks = false;

        } else {

            const startTimeSeconds = Math.round((new Date().getTime() / 1000));

            this.provider.on('block', (blocknumber: number) => {
                this.provider.getBlock(blocknumber).then(block => {

                    ethers.utils.fetchJson('http://' + this.nodeAddress + ':8545',
                        '{"jsonrpc":"2.0","method":"txpool_status","params":[],"id":1}').then(response => {
                        const txPool = new TxPool();
                        txPool.mined = block.transactions.length;
                        txPool.pending = parseInt(response.result.pending, 16);
                        txPool.queued = parseInt(response.result.queued, 16);
                        txPool.timestampSeconds = block.timestamp - startTimeSeconds;
                        this.txPoolStatus.push(txPool);
                        console.log('tx pool: pending=' + txPool.pending + ', queued=' + txPool.queued);
                    });

                    block.transactions.forEach(txHash => {
                        const txData = new TxData();
                        txData.txhash = txHash;
                        txData.succeeded = true;
                        txData.blocknumber = block.number;
                        txData.mined = block.timestamp * 1000;
                        this.results.set(txHash, txData);
                    });

                    console.log('new block ' + blocknumber + ' with ' + block.transactions.length + ' TXs');
                });
            });
            this.listenForBlocks = true;
        }
    }
}
