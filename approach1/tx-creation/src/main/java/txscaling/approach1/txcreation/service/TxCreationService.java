package txscaling.approach1.txcreation.service;

import txscaling.approach1.txcreation.config.AppProperties;
import txscaling.approach1.txcreation.web.MiddlewareClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;

@Service
@Slf4j
public class TxCreationService {

    private final MiddlewareClient client;
    private final AppProperties properties;

    private TxCreationThread txCreationThread;

    @Autowired
    public TxCreationService(MiddlewareClient client, AppProperties properties) {
        this.client = client;
        this.properties = properties;
    }

    /**
     * starts a new thread that continuously creates transactions
     */
    public void startTransactionRequests() {

        if(this.txCreationThread != null && this.txCreationThread.isAlive()) {
            log.error("cannot start transaction creation: already running");
            throw new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        this.txCreationThread = new TxCreationThread(this.client, this.properties);
        this.txCreationThread.start();
    }

    /**
     * stops the thread that creates transactions
     */
    public void stopTransactionRequests() {
        if(this.txCreationThread != null) {
            this.txCreationThread.sendTxRequests = false;
        }
    }

}
