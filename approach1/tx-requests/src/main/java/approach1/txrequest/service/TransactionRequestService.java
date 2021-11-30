package approach1.txrequest.service;

import approach1.txrequest.config.AppProperties;
import approach1.txrequest.web.DappClient;
import approach1.txrequest.web.TxData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;

import java.util.Date;
import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class TransactionRequestService {

    private int interval = -1;
    private ScheduledExecutorService threadpool;

    private final DappClient client;
    private final AppProperties properties;

    private final Random random = new Random();

    public TransactionRequestService(DappClient client, AppProperties properties) {
        this.client = client;
        this.properties = properties;
    }

    public void startTransactionRequests() {
        if(!(this.threadpool == null || this.threadpool.isShutdown())) {
            log.error("cannot start transaction creation: already running");
            throw new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        this.threadpool = Executors.newScheduledThreadPool(1);
        this.threadpool.scheduleAtFixedRate(() -> {
            TxData txData = new TxData();
            txData.created = new Date();
            txData.content = this.random.nextInt(100);
            this.client.sendTransactionRequest(txData);
        }, 0, this.getInterval(), TimeUnit.MILLISECONDS);
    }

    public void stopTransactionRequests() {
        this.threadpool.shutdown();
    }

    public int getInterval() {
        if(this.interval == -1) {
            this.interval = this.properties.requestInterval;
            log.info("set request interval to " + this.interval);
        }
        if(this.interval < 1) {
            log.error("request nterval must not be smaller than 1 ms");
            throw new RuntimeException();
        }
        return this.interval;
    }

    public int setInterval(int interval) {
        if(interval < 1) {
            log.error("request interval must not be smaller than 1 ms");
            throw new RuntimeException();
        }
        this.interval = interval;
        log.info("set request interval to " + this.interval);
        return this.interval;
    }

}
