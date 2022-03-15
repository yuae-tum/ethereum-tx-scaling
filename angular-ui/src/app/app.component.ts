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

    /**
     * Establishes a WebSocket connection to the Ethereum node using the nodeAddress
     */
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

    /**
     * defines a Listener with a callback function that is called every time a new block is mined. The callback function
     * fetches information from the block, such as the timestamp and the included transactions. It also fetches the
     * current status of the transaction pool upon receiving a new block.
     * If there already is an active Listener, it is stopped.
     */
    toggleBlockListener(): void {
        if (this.listenForBlocks) {

            this.provider.off('block');
            this.listenForBlocks = false;

        } else {

            this.provider.on('block', (blocknumber: number) => {
                this.provider.getBlock(blocknumber).then(block => {
                    const timestamp = block.timestamp * 1000;

                    // get tx pool status (number of pending and queued transactions)
                    ethers.utils.fetchJson('http://' + this.nodeAddress + ':8545',
                        '{"jsonrpc":"2.0","method":"txpool_status","params":[],"id":1}').then(response => {
                        const txPool = new TxPool();
                        txPool.mined = block.transactions.length;
                        txPool.pending = parseInt(response.result.pending, 16);
                        txPool.queued = parseInt(response.result.queued, 16);
                        txPool.timestamp = timestamp;
                        txPool.blocknumber = block.number;
                        this.txPoolStatus.push(txPool);
                        console.log('new block ' + blocknumber + ' with ' + block.transactions.length + ' TXs, '
                            + 'pending=' + txPool.pending + ', queued=' + txPool.queued);
                    });

                    // collect tx data
                    block.transactions.forEach(txHash => {
                        const txData = new TxData();
                        txData.txhash = txHash;
                        txData.succeeded = true;
                        txData.blocknumber = block.number;
                        txData.mined = timestamp;
                        this.results.set(txHash, txData);
                    });

                });
            });

            this.listenForBlocks = true;
        }
    }
}
