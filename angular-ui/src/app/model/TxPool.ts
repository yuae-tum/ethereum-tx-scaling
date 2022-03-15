/**
 * stores information the transaction pool right after a new block was mined
 */
export class TxPool {
    timestamp: number;
    blocknumber: number;
    mined: number;
    pending: number;
    queued: number;
}
