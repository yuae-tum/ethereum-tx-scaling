import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TxData} from "../../model/TxData";
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {Color, Label} from "ng2-charts";

@Component({
    selector: 'app-transaction-chart',
    templateUrl: './transaction-chart.component.html',
    styleUrls: ['./transaction-chart.component.scss']
})
export class TransactionChartComponent implements OnInit {

    @Input() yAxesData: number[];
    @Input() xAxesData: string[];
    @Input() label: string;


    transactionData: ChartDataSets[] = [
        {
          // @ts-ignore
          data: this.yAxesData,
          // @ts-ignore
          label: this.label,
          fill: false
        }
    ];

    chartType: ChartType = 'line';

    chartColors: Color[] = [
        {borderColor: 'black', pointBackgroundColor: 'black'},
        {borderColor: 'blue', pointBackgroundColor: 'blue'},
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
    };

    constructor() {
    }

    ngOnInit(): void {
    }

}
