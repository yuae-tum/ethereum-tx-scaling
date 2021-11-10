import {Component, OnInit} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {Color, Label} from "ng2-charts";
import {ethers} from "ethers";

@Component({
    selector: 'app-transaction-chart',
    templateUrl: './transaction-chart.component.html',
    styleUrls: ['./transaction-chart.component.scss']
})
export class TransactionChartComponent implements OnInit {

    /*
    * Listening for Events creates a lot of requests per second itself, that is why
    * we define a second provider which directly accesses a geth node and skips the load balancer
    */
    private provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

    pendingTransactionData: number[] = [];
    successfulTransactionData: number[] = [];
    failedTransactionData: number[] = [];

    transactionData: ChartDataSets[] = [
        {
            data: this.pendingTransactionData,
            label: 'Pending Transactions',
            fill: false
        },
        {
            data: this.successfulTransactionData,
            label: 'Successful Transactions',
            fill: false
        },
        {
            data: this.failedTransactionData,
            label: 'Failed Transactions',
            fill: false
        }
    ];

    chartType: ChartType = 'line';
    timeLabels: Label[] = [];

    chartColors: Color[] = [
        {borderColor: "black", pointBackgroundColor: 'black'},
        {borderColor: "blue", pointBackgroundColor: 'blue'},
        {borderColor: 'red', pointBackgroundColor: 'red'}
    ];

    chartOptions: ChartOptions = {
        aspectRatio: 3,
        animation: {
            duration: 0
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
            }]
        }
    }


    pendingTransactions: Map<string, ethers.Transaction> = new Map<string, ethers.Transaction>();
    totalCount = 0;
    failureCount = 0;
    successCount = 0;

    successfulTransactionsBefore = 0;
    failedTransactionsBefore = 0;
    seconds = 0
    maxRecords = 50;

    shouldRecord = false;

    constructor() { }

    ngOnInit(): void {
    }

    toggleRecording() {
        this.shouldRecord = ! this.shouldRecord;
        if (this.shouldRecord) {
            this.totalCount = 0;
            this.failureCount = 0;
            this.successCount = 0;
            this.successfulTransactionsBefore = 0;
            this.failedTransactionsBefore = 0;
            this.seconds = 0
            this.recording();
            this.setupListenerForPendingRequests();
        } else {
            this.provider.off('pending');
        }
    }

    recording() {
        setTimeout(() => {
            const successful = this.successCount;
            const failed = this.failureCount;

            if(this.shouldRecord) this.recording();
            if(this.timeLabels.length === this.maxRecords) this.deleteOldestRecords();

            this.pendingTransactionData.push(this.pendingTransactions.size);
            this.timeLabels.push(this.seconds + 's');
            this.seconds++

            //we only want the number of successful/failed transactions that were added in the last second
            this.successfulTransactionData.push(successful - this.successfulTransactionsBefore);
            this.failedTransactionData.push(failed - this.failedTransactionsBefore);
            this.successfulTransactionsBefore = successful;
            this.failedTransactionsBefore = failed;

        }, 1000)
    }

    deleteOldestRecords() {
        this.pendingTransactionData.shift();
        this.successfulTransactionData.shift();
        this.failedTransactionData.shift();
        this.timeLabels.shift();
    }

    setupListenerForPendingRequests() {
        this.provider.on('pending', (tx: ethers.providers.TransactionResponse) => {
            this.pendingTransactions.set(tx.hash, tx);
            this.totalCount++;
            tx.wait()
                .then(receipt => {
                    if(receipt.status === 1) {
                        this.successCount++;
                    } else {
                        this.failureCount++;
                    }
                }).catch(()=>this.failureCount++)
                .finally(() => this.pendingTransactions.delete(tx.hash));
        });
    }

}
