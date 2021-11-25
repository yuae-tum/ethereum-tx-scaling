import { Component } from '@angular/core';
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
      });
    }
}
