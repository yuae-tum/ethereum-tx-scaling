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

    /**
     * fetches recorded information about the created transactions from a transaction-creating machine and merges
     * it with the information obtained by the block listener
     * @param url the machine's http endpoint
     * @param results collection containing the transaction data from the block listener
     */
    fetchResults(url: string, results: Map<string, TxData>): void {
        this.http.get<TxData[]>(url).subscribe(response => {
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
            this.snackBar.open('Successful');
            console.log('Successfully fetched results');
        }, error => {
            console.log(error);
            this.snackBar.open('Error while fetching results');
        });
    }

    /**
     * writes data to a json file, which is then downloaded
     * @param content the content to be written to the json file
     */
    downloadResults(content: any): void {
        const contentString = JSON.stringify(content);
        const element = document.createElement('a');
        element.style.display = 'none';
        element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(contentString));
        element.setAttribute('download', 'result.json');
        document.body.appendChild(element);
        element.click(); // simulate click
        document.body.removeChild(element);
        console.log(content);
    }

}
