package approach1.txrequest.service;

import approach1.txrequest.config.AppProperties;
import approach1.txrequest.web.DappClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;

@Service
@Slf4j
public class TransactionRequestService {

    private final DappClient client;
    private final AppProperties properties;

    private TxRequestingThread txRequestingThread;

    @Autowired
    public TransactionRequestService(DappClient client, AppProperties properties) {
        this.client = client;
        this.properties = properties;
    }

    public void startTransactionRequests() {

        if(this.txRequestingThread != null && this.txRequestingThread.isAlive()) {
            log.error("cannot start transaction creation: already running");
            throw new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        this.txRequestingThread = new TxRequestingThread(this.client, this.properties);
        this.txRequestingThread.start();
    }

    public void stopTransactionRequests() {
        if(this.txRequestingThread != null) {
            this.txRequestingThread.sendTxRequests = false;
        }
    }

}
