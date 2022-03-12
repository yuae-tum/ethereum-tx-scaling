package txscaling.approach1.middleware.web;

/**
 * represents an Ethereum transaction
 */
public class TxData {

    public String txhash;
    public int nonce;
    public boolean succeeded;
    public long created;
    public int blocknumber;
    public long mined;
    public long waitingTime;
    public int content; // used as an argument when calling the Smart Contract's function
    public String machineId;

}