package txscaling.approach1.middleware.service;

import txscaling.approach1.middleware.config.Web3jConfiguration;
import txscaling.approach1.middleware.web.TxData;
import txscaling.approach1.middleware.contracts.DappBackend;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.crypto.RawTransaction;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.tx.RawTransactionManager;

import java.io.IOException;
import java.math.BigInteger;
import java.util.*;

@Slf4j
@Service
public class MiddlewareService {

    private final Web3jConfiguration config;
    private RawTransactionManager transactionManager;
    private BigInteger currentNonce;

    private LinkedList<TxData> txRecords = new LinkedList<>();

    private static final Object nonceLock = new Object();
    private static final Object listLock = new Object();

    @Autowired
    public MiddlewareService(Web3jConfiguration config) {
        this.config = config;
    }

    /**
     * returns the version of the Ethereum Node
     * @return version of the Ethereum Node
     */
    public String getNodeVersion() {
        Web3j web3j = this.config.getWeb3jInstance();
        try {
            this.fetchCurrentNonce();
            return web3j.web3ClientVersion().send().getWeb3ClientVersion();
        } catch (IOException e) {
            e.printStackTrace();
            throw new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * adds the nonce to a transaction object, signs it, and forwards it to the Ethereum Network
     * @param txData the transaction object
     * @throws IOException if fetching of the current nonce or forwarding of the transaction fails
     */
    public void submitTransaction(TxData txData) throws IOException {

        BigInteger nonce = this.getNonceAndIncrement();
        txData.nonce = nonce.intValue();

        Function function = new Function(
                DappBackend.FUNC_PROCESSTRANSACTION,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Int256(BigInteger.valueOf(txData.content))),
                Collections.emptyList());
        String data = FunctionEncoder.encode(function);

        RawTransaction rawTransaction = RawTransaction.createTransaction(
                nonce,
                BigInteger.valueOf(2000000000), //gasPrice
                BigInteger.valueOf(1000000), //gasLimit
                this.config.getSmartContractAddress(),
                BigInteger.ZERO, //value
                data);

        txData.txhash = this.getTransactionManager().signAndSend(rawTransaction).getTransactionHash();
        log.info("{} Transaction submitted, hash: {}", txData.nonce, txData.txhash);
        synchronized (listLock) {
            this.txRecords.add(txData);
        }
    }

    /**
     * returns the collected data about all created transactions
     * @return list of transaction information
     */
    public List<TxData> collectReceipts() {
        log.info("collecting receipts of " + this.txRecords.size() + " TXs");
        return txRecords;
    }

    /**
     * clears the collected data about the created transactions
     * @return list of transaction information
     */
    public List<TxData> deleteReceipts() {
        log.info("Deleting " + this.txRecords.size() + " receipts");
        LinkedList<TxData> receipts = this.txRecords;
        this.txRecords = null;
        return receipts;
    }

    /**
     * returns value of the local nonce counter and increases it by one
     * @return current nonce
     */
    private BigInteger getNonceAndIncrement() throws IOException {
        synchronized (nonceLock) {
            if(this.currentNonce == null) {
                this.fetchCurrentNonce();
            }
            BigInteger nonce = this.currentNonce;
            this.currentNonce = this.currentNonce.add(BigInteger.ONE);
            return nonce;
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
