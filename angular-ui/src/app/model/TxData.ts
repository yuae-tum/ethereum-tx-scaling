/**
 * represents an Ethereum transaction
 */
export class TxData {
    machineId: string;
    txhash: string;
    nonce: number;
    succeeded: boolean;
    created: number;
    blocknumber: number;
    mined: number;
    waitingTime: number;
    content: number;
}
