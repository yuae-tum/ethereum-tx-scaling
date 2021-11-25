import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {ethers} from "ethers";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TxData} from "../../model/TxData";

@Component({
    selector: 'app-approach1',
    templateUrl: './approach1.component.html',
    styleUrls: ['./approach1.component.scss']
})
export class Approach1Component implements OnInit {

    @Input() provider: ethers.providers.WebSocketProvider;

    numberMachines = 1;
    machines: MachineData[] = [];

    results: TxData[] = [{"txhash":"0xa8a93c34d00388d57cb4bef59add05e73a6fd03cb337b9a329bd14ed11fbce04","nonce":112,"succeeded":true,"created":1637510495019,"blocknumber":21,"mined":1637510499000,"waitingTime":3981,"machineIndex":0},{"txhash":"0x56c0ecccc932c23419fe6593d1987d615ec4459f207d506b969c1df19edd2ee4","nonce":113,"succeeded":true,"created":1637510496014,"blocknumber":21,"mined":1637510499000,"waitingTime":2986,"machineIndex":0},{"txhash":"0x48405762f7e17d4b230dbbf297539de913c1488d07038c48423257bdebff8296","nonce":114,"succeeded":true,"created":1637510497010,"blocknumber":21,"mined":1637510499000,"waitingTime":1990,"machineIndex":0},{"txhash":"0x5ba0a7469a622091adeb6a602e3bb01aae842d5f561b90711a56a3fcbe0397ea","nonce":115,"succeeded":true,"created":1637510498011,"blocknumber":22,"mined":1637510509000,"waitingTime":10989,"machineIndex":0},{"txhash":"0xce86bd232dfc95086906e92c0f6ee2fdf800c91e398f182098639f0b34f5d396","nonce":116,"succeeded":true,"created":1637510499009,"blocknumber":22,"mined":1637510509000,"waitingTime":9991,"machineIndex":0},{"txhash":"0x3dccf2f29f07160c484c73efe851bc511354f62791cc5a05d66397f38b3d010b","nonce":117,"succeeded":true,"created":1637510500008,"blocknumber":22,"mined":1637510509000,"waitingTime":8992,"machineIndex":0},{"txhash":"0x24c22266cadbffe046e1fce6ada59679b9c07f0d46bc8ce71ce56152678b6f6d","nonce":118,"succeeded":true,"created":1637510501008,"blocknumber":22,"mined":1637510509000,"waitingTime":7992,"machineIndex":0},{"txhash":"0xd7c8bf86d6244ade44bba17db04a0b93a72ccc98d3fe0ae10d32b7726d280b1a","nonce":119,"succeeded":true,"created":1637510502008,"blocknumber":22,"mined":1637510509000,"waitingTime":6992,"machineIndex":0},{"txhash":"0x7bcdd978cf31bcf50a4c60480fbda2aef3809fa40b8ce478d4206b8a952fe5ea","nonce":120,"succeeded":true,"created":1637510503007,"blocknumber":22,"mined":1637510509000,"waitingTime":5993,"machineIndex":0},{"txhash":"0x9257195823e432b466a3964dd3babe2cfbcba13d88a9b0ba5b5b22b6ff38e579","nonce":121,"succeeded":true,"created":1637510504006,"blocknumber":22,"mined":1637510509000,"waitingTime":4994,"machineIndex":0},{"txhash":"0xfaee6678cd746706952576eff9e7261d2b51bcf3e1a8568a89d8367d66a4c13d","nonce":122,"succeeded":true,"created":1637510505007,"blocknumber":22,"mined":1637510509000,"waitingTime":3993,"machineIndex":0},{"txhash":"0x29c25f2f1eea2344a7422499cfb1bf17085251c91fc6fe682646cabbe3fcb675","nonce":123,"succeeded":true,"created":1637510506007,"blocknumber":22,"mined":1637510509000,"waitingTime":2993,"machineIndex":0},{"txhash":"0xac3a1729691578eb952bb3005d496a1239621c90c912322b1e4c568bc1b59d6c","nonce":124,"succeeded":true,"created":1637510507007,"blocknumber":22,"mined":1637510509000,"waitingTime":1993,"machineIndex":0},{"txhash":"0xb4393fc25b8764ba0a1122c7de17dc8c974ad7005746681d47d8f4331942b8cb","nonce":125,"succeeded":true,"created":1637510508009,"blocknumber":23,"mined":1637510519000,"waitingTime":10991,"machineIndex":0},{"txhash":"0x7bf0279de1ef52b8507ff2ad8095648c0873b35323c00d37417ca80d97154f52","nonce":126,"succeeded":true,"created":1637510509008,"blocknumber":23,"mined":1637510519000,"waitingTime":9992,"machineIndex":0},{"txhash":"0x93c6d78eb6089c7609fd82bb945c6dba6884181730e9af6884d2c935eb233aef","nonce":127,"succeeded":true,"created":1637510510006,"blocknumber":23,"mined":1637510519000,"waitingTime":8994,"machineIndex":0},{"txhash":"0xc03118a2786155b14f4930b5b5d2a72dac5254e84d0dafd355783169f9f15812","nonce":128,"succeeded":true,"created":1637510511007,"blocknumber":23,"mined":1637510519000,"waitingTime":7993,"machineIndex":0},{"txhash":"0xc6213ba881958c968bc55e910d5863bdb281ace689e7300e576f88b521cb4f82","nonce":129,"succeeded":true,"created":1637510512007,"blocknumber":23,"mined":1637510519000,"waitingTime":6993,"machineIndex":0},{"txhash":"0x0b06db5118c51fba72d077004756f205ec403a724f91f326dc3f85194dde26bb","nonce":130,"succeeded":true,"created":1637510513007,"blocknumber":23,"mined":1637510519000,"waitingTime":5993,"machineIndex":0},{"txhash":"0x56de020e4f45b7dbaae14fa3756285eb9b8d6357a119d4f523648ef6185dc66f","nonce":131,"succeeded":true,"created":1637510514007,"blocknumber":23,"mined":1637510519000,"waitingTime":4993,"machineIndex":0},{"txhash":"0xc49006f43872a5548dcd8c149160e61998f27cd9799cff40a79055ca7fc2e978","nonce":132,"succeeded":true,"created":1637510515008,"blocknumber":23,"mined":1637510519000,"waitingTime":3992,"machineIndex":0},{"txhash":"0x0abff85b3c125055ac954859ab97323e762a1c1b340c0c05397ba657169b1008","nonce":133,"succeeded":true,"created":1637510516007,"blocknumber":23,"mined":1637510519000,"waitingTime":2993,"machineIndex":0},{"txhash":"0x085348b14fd4ac8d8be088e3479227614d2ab73695a976e0833efa181b3b5236","nonce":134,"succeeded":true,"created":1637510517007,"blocknumber":23,"mined":1637510519000,"waitingTime":1993,"machineIndex":0},{"txhash":"0x9c3ac3295e14871eab394ce1ec243dc20fdf1762b23dbc6a7f4313075fc78d41","nonce":135,"succeeded":true,"created":1637510518011,"blocknumber":24,"mined":1637510529000,"waitingTime":10989,"machineIndex":0},{"txhash":"0x7ca5d719b12affbc216762d91613c11723aad6248b465922e49adb27c6d554f1","nonce":136,"succeeded":true,"created":1637510519006,"blocknumber":24,"mined":1637510529000,"waitingTime":9994,"machineIndex":0},{"txhash":"0xa572c9004e2f894dfc099230ea6e16217e35fabe1ee373402cc2935c2aea4f02","nonce":137,"succeeded":true,"created":1637510520007,"blocknumber":24,"mined":1637510529000,"waitingTime":8993,"machineIndex":0},{"txhash":"0xed25917e096c72b7e183ff645b561c2fd9b133b32af424d55eacb8d8208f10ba","nonce":138,"succeeded":true,"created":1637510521007,"blocknumber":24,"mined":1637510529000,"waitingTime":7993,"machineIndex":0},{"txhash":"0xdbf1f718bdc3380a62131e0b525aebadb502047911c56407bd20458ce3e9c7ad","nonce":139,"succeeded":true,"created":1637510522007,"blocknumber":24,"mined":1637510529000,"waitingTime":6993,"machineIndex":0},{"txhash":"0x348b4e33986751bc3c2540899e819384359f706fc210db05cc6a0ff7edc79d89","nonce":140,"succeeded":true,"created":1637510523007,"blocknumber":24,"mined":1637510529000,"waitingTime":5993,"machineIndex":0},{"txhash":"0x6262d861a5518defa7dbe3ad7d4d7276802bbcfeaaef449e1bb8dc4d58220add","nonce":141,"succeeded":true,"created":1637510524007,"blocknumber":24,"mined":1637510529000,"waitingTime":4993,"machineIndex":0},{"txhash":"0x7f39367a227141d400fe796ca2402b17bdd7ca464a8b2cbb4be89edaf95ebd65","nonce":142,"succeeded":true,"created":1637510525007,"blocknumber":24,"mined":1637510529000,"waitingTime":3993,"machineIndex":0},{"txhash":"0x1bca5f87c52edbd39d05f6ad0a9d7ba19563332d7fa4a93ba0f0e2cdd8fb961c","nonce":143,"succeeded":true,"created":1637510526007,"blocknumber":24,"mined":1637510529000,"waitingTime":2993,"machineIndex":0},{"txhash":"0x965fa5ca07978889a351e03eb96c568221216107f3f0ca0d80d744c2f1e8a01c","nonce":144,"succeeded":true,"created":1637510527007,"blocknumber":24,"mined":1637510529000,"waitingTime":1993,"machineIndex":0},{"txhash":"0x028367b899159c84b01e6ed05f409e02c1fe22c179a371f12c43f0c918738d05","nonce":145,"succeeded":true,"created":1637510528006,"blocknumber":25,"mined":1637510539000,"waitingTime":10994,"machineIndex":0},{"txhash":"0xa85cd8e8d93e2825062b4b9d831edda95e306f2d6caad017657561e478d62e3a","nonce":146,"succeeded":true,"created":1637510529006,"blocknumber":25,"mined":1637510539000,"waitingTime":9994,"machineIndex":0},{"txhash":"0x2bb492cbd5c2668c316b319c865906187b18f6f549b34fa2ac158400b0224f11","nonce":147,"succeeded":true,"created":1637510530007,"blocknumber":25,"mined":1637510539000,"waitingTime":8993,"machineIndex":0},{"txhash":"0x0c46b636500c17d305d193325bd1863055d34cd7c56d2de19c8e1549899e8da4","nonce":148,"succeeded":true,"created":1637510531007,"blocknumber":25,"mined":1637510539000,"waitingTime":7993,"machineIndex":0},{"txhash":"0x15b2f8f33cdd3c1b2fcc0e02618da5a5d3bbe334d218853abc07fd3ac8e42408","nonce":149,"succeeded":true,"created":1637510532006,"blocknumber":25,"mined":1637510539000,"waitingTime":6994,"machineIndex":0},{"txhash":"0xe39ed5928ed8961a522ecc75a8e35a0232442dc7afcb6f21e9e98702b0795073","nonce":150,"succeeded":true,"created":1637510533007,"blocknumber":25,"mined":1637510539000,"waitingTime":5993,"machineIndex":0},{"txhash":"0x535bdb4f986a89dcf2d9a3fcf77ab904db55815f2cb1e3977b2f226ab792ad78","nonce":151,"succeeded":true,"created":1637510534007,"blocknumber":25,"mined":1637510539000,"waitingTime":4993,"machineIndex":0},{"txhash":"0xb070fd77d32a19de5b822b88915d0484f13762232985d7039c10f92a694ab373","nonce":152,"succeeded":true,"created":1637510535008,"blocknumber":25,"mined":1637510539000,"waitingTime":3992,"machineIndex":0},{"txhash":"0xef43a720ffc683a11268b535825b51e35e8501697f1baa740c6648da3146d3b7","nonce":153,"succeeded":true,"created":1637510536007,"blocknumber":25,"mined":1637510539000,"waitingTime":2993,"machineIndex":0},{"txhash":"0x4715f73db32a0dc2f3ad322329978ce74aaf8020e43fb8921451d760ac354bb7","nonce":154,"succeeded":true,"created":1637510537007,"blocknumber":25,"mined":1637510539000,"waitingTime":1993,"machineIndex":0},{"txhash":"0x768d542209c6bfa0ebe6c5674de116f647ddc1649142fc8664eddc86cb5192d0","nonce":155,"succeeded":true,"created":1637510538007,"blocknumber":26,"mined":1637510549000,"waitingTime":10993,"machineIndex":0},{"txhash":"0x2400c69f3e70e780f40f1b36a1bd7dab37460bedd10ea80be231c6acc080b0d2","nonce":156,"succeeded":true,"created":1637510539006,"blocknumber":26,"mined":1637510549000,"waitingTime":9994,"machineIndex":0},{"txhash":"0xed53cd2d70deb092535e3750d8ac86ae37c04a316b1222f843a146103e336d07","nonce":157,"succeeded":true,"created":1637510540007,"blocknumber":26,"mined":1637510549000,"waitingTime":8993,"machineIndex":0},{"txhash":"0x5985ef5eb4a03d79c97a2ec0233a7dc800f9f002b8d2721e5c9f76a3e88fb3ef","nonce":158,"succeeded":true,"created":1637510541007,"blocknumber":26,"mined":1637510549000,"waitingTime":7993,"machineIndex":0},{"txhash":"0x0ee3e44f39a3dcc4af39a9accdfce021b8c2fe6eff8f315e243d083a2e3b4b00","nonce":159,"succeeded":true,"created":1637510542006,"blocknumber":26,"mined":1637510549000,"waitingTime":6994,"machineIndex":0},{"txhash":"0xf30d31eabee8114ed11a4846870d9e8af02a422c557f8762f084820ac9e4ffc6","nonce":160,"succeeded":true,"created":1637510543007,"blocknumber":26,"mined":1637510549000,"waitingTime":5993,"machineIndex":0},{"txhash":"0xbb93cbdf6bd27fec861f8b70879863e3e458ef0b3b5a547643cf8326e6ea8d18","nonce":161,"succeeded":true,"created":1637510544007,"blocknumber":26,"mined":1637510549000,"waitingTime":4993,"machineIndex":0},{"txhash":"0xa96be06a454067b81fd8e318e3880383bcefc330a54b2578f094cd7306a5e043","nonce":162,"succeeded":true,"created":1637510545007,"blocknumber":26,"mined":1637510549000,"waitingTime":3993,"machineIndex":0},{"txhash":"0xd2ffadb28b49d4539efbe3eac3a2c843d352a2df1ec3540f68811e94976baa6d","nonce":163,"succeeded":true,"created":1637510546007,"blocknumber":26,"mined":1637510549000,"waitingTime":2993,"machineIndex":0},{"txhash":"0x69e3825d583166b5d771ad43ec37f79d596e6381324892d0cd53b84582357445","nonce":164,"succeeded":true,"created":1637510547007,"blocknumber":26,"mined":1637510549000,"waitingTime":1993,"machineIndex":0}];

    waitingTimeDistributionXAxes: string[] = [];
    waitingTimeDistributionYAxes: number[] = [];

    constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

    ngOnInit(): void {
    }

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

    setBaseUrl(machine: MachineData, url: string): void {
        // @ts-ignore
        this.http.get<string>(url + '/node-version', { responseType: 'text' }).subscribe(response => {
            console.log(response);
            machine.url = url;
            console.log('geth node version: ' + response);
            this.snackBar.open('Connection successful');
            this.getCurrentAccount(machine);
            this.getCurrentContractAddress(machine);
            this.getCurrentTxInterval(machine);
        }, error => {
            console.log(error);
            this.snackBar.open('Connection failed');
        });
    }

    getCurrentAccount(machine: MachineData): void {
        this.http.get<any>(machine.url + '/account').subscribe(response => {
            machine.accountAddress = response.address;
            machine.publicKey = response.publicKey;
            machine.privateKey = response.privateKey;
        }, error => {
            console.log(error);
            this.snackBar.open('Error while fetching Account');
        });
    }

    setAccount(machine: MachineData, privateKey: string): void {
        this.http.post<any>(machine.url + '/account', privateKey).subscribe(response => {
            machine.accountAddress = response.address;
            machine.publicKey = response.publicKey;
            machine.privateKey = response.privateKey;
        }, error => {
            console.log(error);
            this.snackBar.open('Error while setting Account');
        });
    }

    getCurrentContractAddress(machine: MachineData): void {
        // @ts-ignore
        this.http.get<string>(machine.url + '/contract', { responseType: 'text' }).subscribe(response => {
            machine.contractAddress = response;
        }, error => {
            console.log(error);
            this.snackBar.open('Error while fetching contract address');
        });
    }

    setContractAddress(machine: MachineData, contractAddress: string): void {
        this.http.post<string>(machine.url + '/contract', contractAddress).subscribe(response => {
            machine.contractAddress = response;
        }, error => {
            console.log(error);
            this.snackBar.open('Error while setting contract address');
        });
    }

    getCurrentTxInterval(machine: MachineData): void {
        this.http.get<number>(machine.url + '/tx-interval').subscribe(response => {
            machine.interval = response;
        }, error => {
            console.log(error);
            this.snackBar.open('Error while fetching tx interval');
        });
    }

    setTxInterval(machine: MachineData, interval: string): void {
        this.http.post<number>(machine.url + '/tx-interval', parseInt(interval, 10)).subscribe(response => {
            machine.interval = response;
        }, error => {
            console.log(error);
            this.snackBar.open('Error while fetching tx interval');
        });
    }

    startTxCreation(machine: MachineData): void {
        this.http.get<void>(machine.url + '/start-tx-creation').subscribe(() => {
            machine.isRunning = true;
            this.snackBar.open('Started transaction creation');
        }, error => {
            console.log(error);
            this.snackBar.open('Error while starting transaction creation');
        });
    }

    stopTxCreation(machine: MachineData): void {
        this.http.get(machine.url + '/stop-tx-creation').subscribe(() => {
            machine.isRunning = false;
            this.snackBar.open('Stopped transaction creation');
        }, error => {
            console.log(error);
            this.snackBar.open('Error while stopping transaction creation');
        });
    }

    fetchResults(machine: MachineData): void {
        this.http.get<TxData[]>(machine.url + '/receipts').subscribe(response => {
            response.forEach(txData => txData.machineIndex = machine.index);
            this.results.push(...response);
        }, error => {
            console.log(error);
            this.snackBar.open('Error while fetching results');
        });
    }

    startAllMachines(): void {
        if (this.machines.some(machine => machine.url == null)) {
            this.snackBar.open('Failed, set base URL for every machine');
        } else {
            this.machines.forEach(machine => this.startTxCreation(machine));
        }
    }

    stopAllMachines(): void {
        this.machines.forEach(machine => this.stopTxCreation(machine));
    }

    fetchAllResults(): void {
        this.machines.forEach(machine => this.fetchResults(machine.index));
    }

    downloadResultsAsJsonFile(): void {
        /*
        const sJson = JSON.stringify(this.results);
        const element = document.createElement('a');
        element.style.display = 'none';
        element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson));
        element.setAttribute('download', 'result.json');
        document.body.appendChild(element);
        element.click(); // simulate click
        document.body.removeChild(element);
        */
        console.log(this.results);
        console.log(this.waitingTimeDistributionXAxes);
        console.log(this.waitingTimeDistributionYAxes);
    }

    updateCharts(): void {
        const waitingTimes = this.results.filter(tx => tx.succeeded).map(tx => Math.round(tx.waitingTime / 1000) * 1000);
        const distribution: Map<number, number> = new Map<number, number>();
        waitingTimes.forEach(time => {
            const amount = distribution.get(time);
            distribution.set(time, amount == null ? 1 : amount + 1);
        });
        this.waitingTimeDistributionXAxes = Array.from(distribution.keys()).map(String);
        this.waitingTimeDistributionYAxes = Array.from(distribution.values());
    }

}

class MachineData {
    index: number;
    url: string;
    isRunning = false;
    interval: number;
    privateKey: string;
    publicKey: string;
    accountAddress: string;
    contractAddress: string;
}
