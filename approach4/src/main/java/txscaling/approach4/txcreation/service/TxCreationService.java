package txscaling.approach4.txcreation.service;

import txscaling.approach4.txcreation.config.Web3jConfiguration;
import txscaling.approach4.txcreation.web.TxData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.support.atomic.RedisAtomicLong;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.tx.RawTransactionManager;

import java.io.IOException;
import java.util.*;

@Service
@Slf4j
public class TxCreationService {

    private final Web3jConfiguration config;
    private final RedisAtomicLong nonceManager;
    private RawTransactionManager transactionManager;

    private TxCreationThread txCreationThread;

    private LinkedList<TxData> txRecords = new LinkedList<>();

    @Autowired
    public TxCreationService(Web3jConfiguration config, RedisAtomicLong nonceManager) {
        this.config = config;
        this.nonceManager = nonceManager;
    }

    /**
     * returns the version of the Ethereum Node
     * @return version of the Ethereum Node
     */
    public String getNodeVersion() {
        Web3j web3j = this.config.getWeb3jInstance();
        try {
            return web3j.web3ClientVersion().send().getWeb3ClientVersion();
        } catch (IOException e) {
            e.printStackTrace();
            throw new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * starts a new thread that continuously creates transactions
     */
    public void startTransactionCreation() {

        if(this.txCreationThread != null && this.txCreationThread.isAlive()) {
            log.error("cannot start transaction creation: already running");
            throw new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        this.txCreationThread = new TxCreationThread(this.nonceManager, this.config, this.getTransactionManager(), this.txRecords);
        this.txCreationThread.start();
    }

    /**
     * stops the thread that creates transactions
     */
    public void stopTransactionCreation() {
        if(this.txCreationThread != null) {
            this.txCreationThread.createTransactions = false;
        }
    }

    /**
     * returns the collected data about all created transactions
     * @return list of transaction information
     */
    public List<TxData> collectReceipts() {
        log.info("Collecting receipts of " + this.txRecords.size() + " TXs");
        return this.txRecords;
    }

    /**
     * clears the collected data about the created transactions
     * @return list of transaction information
     */
    public List<TxData> deleteReceipts() {
        if(this.txCreationThread == null || !this.txCreationThread.createTransactions) {
            log.info("Collecting receipts of " + this.txRecords.size() + " TXs");
            List<TxData> receipts = this.txRecords;
            this.txRecords = new LinkedList<>();
            return receipts;
        } else {
            throw  new RuntimeException("Can't delete receipts while tx creation is running");
        }
    }

    /**
     * requests the current account nonce from the Ethereum Network and updates the counter
     * stored at the Nonce Manager accordingly
     * @return current nonce
     */
    public long synchronizeNonce() {
        try {
            long nonce = this.config.getWeb3jInstance()
                    .ethGetTransactionCount(this.config.getCredentials().getAddress(), DefaultBlockParameterName.PENDING)
                    .send().getTransactionCount().longValue();
            this.nonceManager.set(nonce);
            nonce = this.nonceManager.get();
            log.info("current nonce: " + nonce);
            return nonce;
        } catch (IOException e) {
            log.error("Error while synchronizing nonce", e);
            throw new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * returns an instance of the web3j-RawTransactionManager, creates a new one of non exists yet;
     * the RawTransactionManager can be used to sign transactions and send them to the Ethereum Network
     * @return web3j-RawTransactionManager
     */
    private RawTransactionManager getTransactionManager() {
        if(this.transactionManager == null) {
            String chainId;
            try {
                chainId = this.config.getWeb3jInstance().netVersion().send().getNetVersion();
            } catch (IOException e) {
                log.error("error while fetching chainId", e);
                throw new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR);
            }
            log.info("Ethereum Network chainId: " + chainId);
            this.transactionManager = new RawTransactionManager(this.config.getWeb3jInstance(), this.config.getCredentials(), Long.parseLong(chainId));
        }
        return this.transactionManager;
    }

}
