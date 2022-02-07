package approach1.txrequest.service;

import approach1.txrequest.config.AppProperties;
import approach1.txrequest.web.DappClient;
import approach1.txrequest.web.TxData;
import lombok.extern.slf4j.Slf4j;

import java.util.Date;
import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
public class TxRequestingThread extends Thread {

    public boolean sendTxRequests = true;

    private final DappClient client;
    private final AppProperties properties;

    private final Random random = new Random();

    private int numberSentTX = 0;
    private final ScheduledExecutorService threadpool = Executors.newScheduledThreadPool(1);

    public TxRequestingThread(DappClient client, AppProperties properties) {
        this.client = client;
        this.properties = properties;
    }

    @Override
    public void run() {
        this.threadpool.scheduleAtFixedRate(() -> {
            log.info("created " + this.numberSentTX + " tx requests in 5 seconds");
            this.numberSentTX = 0;
        }, 0, 5, TimeUnit.SECONDS);
        while(this.sendTxRequests) {
            TxData txData = new TxData();
            txData.created = new Date().getTime();
            txData.content = this.random.nextInt(100);
            txData.machineId = this.properties.machineId;
            try {
                this.client.sendTransactionRequest(txData);
                this.numberSentTX++;
            } catch (Exception e) {
                log.error("Error while sending TX Request", e);
                this.threadpool.shutdown();
                this.sendTxRequests = false;
                return;
            }

        }
        this.threadpool.shutdown();
    }
}
