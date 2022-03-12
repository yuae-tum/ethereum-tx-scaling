package txscaling.approach1.txcreation.service;

import txscaling.approach1.txcreation.config.AppProperties;
import txscaling.approach1.txcreation.web.MiddlewareClient;
import txscaling.approach1.txcreation.web.TxData;
import lombok.extern.slf4j.Slf4j;

import java.util.Date;
import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
public class TxCreationThread extends Thread {

    public boolean sendTxRequests = true;

    private final MiddlewareClient client;
    private final AppProperties properties;

    private final Random random = new Random();

    private int numberSentTX = 0;
    private final ScheduledExecutorService threadpool = Executors.newScheduledThreadPool(1);

    public TxCreationThread(MiddlewareClient client, AppProperties properties) {
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
