import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TxData} from '../model/TxData';

@Injectable({
    providedIn: 'root'
})
export class EthereumService {

    constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    }

    fetchResults(url: string, results: Map<string, TxData>): void {
        this.http.get<TxData[]>(url).subscribe(response => {
            this.snackBar.open('Successful');
            response.forEach(txData => {
                const resultTx = results.get(txData.txhash);
                if (!resultTx) {
                    results.set(txData.txhash, txData);
                } else {
                    resultTx.created = txData.created;
                    resultTx.waitingTime = resultTx.mined - resultTx.created;
                    resultTx.nonce = txData.nonce;
                    resultTx.content = txData.content;
                    resultTx.machineId = txData.machineId;
                }
            });
        }, error => {
            console.log(error);
            this.snackBar.open('Error while fetching results');
        });
    }

}
