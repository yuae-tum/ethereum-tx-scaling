package approach1.service;

import approach1.config.Web3jConfiguration;
import approach1.contracts.DappBackend;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web3j.protocol.Web3j;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class TransactionCreationService {

    private final Web3jConfiguration config;
    private ExecutorService threadpool;
    private boolean shouldCreateTransactions;

    @Autowired
    public TransactionCreationService(Web3jConfiguration config) {
        this.config = config;
    }

    public void createTransactions () {
        this.threadpool = Executors.newFixedThreadPool(4);
        this.shouldCreateTransactions = true;
    }
}
