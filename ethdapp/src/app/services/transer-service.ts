import {Injectable} from "@angular/core";
import {ethers} from "ethers";

declare let window: any;

@Injectable({
    providedIn: 'root'
})
export class TranserService {

    private provider:  ethers.providers.JsonRpcProvider;

    constructor() {}

    getProvider() {
        if(this.provider == null) {
            //this.provider = new ethers.providers.Web3Provider(window.ethereum);
            //this.provider = ethers.providers.getDefaultProvider('http://localhost:8545');
            this.provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
        }
        return this.provider;
    }

}
