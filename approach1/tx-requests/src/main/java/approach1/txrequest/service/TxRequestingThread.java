package approach1.txrequest.service;

import approach1.txrequest.config.AppProperties;
import approach1.txrequest.web.DappClient;
import approach1.txrequest.web.TxData;

import java.util.Date;
import java.util.Random;

public class TxRequestingThread extends Thread {

    public boolean sendTxRequests = true;

    private final DappClient client;
    private final AppProperties properties;

    private final Random random = new Random();

    public TxRequestingThread(DappClient client, AppProperties properties) {
        this.client = client;
        this.properties = properties;
    }

    @Override
    public void run() {
        while(this.sendTxRequests) {
            TxData txData = new TxData();
            txData.created = new Date();
            txData.content = this.random.nextInt(100);
            txData.machineId = this.properties.machineId;
            this.client.sendTransactionRequest(txData);
        }
    }
}
