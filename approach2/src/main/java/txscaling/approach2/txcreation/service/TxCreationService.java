package txscaling.approach2.txcreation.service;

import txscaling.approach2.txcreation.web.TxData;
import txscaling.approach2.txcreation.config.Web3jConfiguration;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.tx.RawTransactionManager;

import java.io.IOException;
import java.math.BigInteger;
import java.util.*;

@Service
@Slf4j
public class TxCreationService {

    private final Web3jConfiguration config;
    private RawTransactionManager transactionManager;
    private BigInteger currentNonce = BigInteger.ZERO;

    private TxCreationThread txCreationThread;

    private LinkedList<TxData> txRecords = new LinkedList<>();

    @Autowired
    public TxCreationService(Web3jConfiguration config) {
        this.config = config;
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

        try {
            this.fetchCurrentNonce();
            this.txCreationThread = new TxCreationThread(this.config, this.getTransactionManager(), this.currentNonce, this.txRecords);
            this.txCreationThread.start();
        } catch (IOException e) {
            log.error("Error while fetching nonce", e);
        }
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
        log.info("collecting receipts of " + this.txRecords.size() + " TXs");
        return this.txRecords;
    }

    /**
     * clears the collected data about the created transactions
     * @return list of transaction information
     */
    public List<TxData> deleteReceipts() {
        if(this.txCreationThread == null || !this.txCreationThread.createTransactions) {
            log.info("deleting receipts of " + this.txRecords.size() + " TXs");
            List<TxData> result = this.txRecords;
            this.txRecords = new LinkedList<>();
            return result;
        } else {
            throw new RuntimeException("Can't delete receipts while tx creation is running");
        }
    }

    /**
     * fetches the current account nonce from the Ethereum Network and updates the local nonce counter
     * @throws IOException if the fetching of the nonce fails
     */
    private void fetchCurrentNonce() throws IOException {
        this.currentNonce = this.config.getWeb3jInstance()
                    .ethGetTransactionCount(this.config.getCredentials().getAddress(), DefaultBlockParameterName.PENDING)
                    .send().getTransactionCount();
        log.info("current nonce: " + this.currentNonce.intValue());
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
