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
    private BigInteger currentNonce = BigInteger.ZERO;

    private LinkedList<TxData> txRecords = new LinkedList<>();

    private static final Object nonceLock = new Object();
    private static final Object listLock = new Object();

    @Autowired
    public MiddlewareService(Web3jConfiguration config) {
        this.config = config;
    }

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

        /*this.config.getWeb3jInstance().ethSendRawTransaction(this.getTransactionManager().sign(rawTransaction))
                .sendAsync().thenAccept(tx -> {
                    log.info("{} Transaction submitted, hash: {}", txData.nonce, tx.getTransactionHash());
                    txData.txhash = tx.getTransactionHash();
                    this.txRecords.add(txData);
                });*/
    }

    public List<TxData> collectReceipts() {
        log.info("collecting receipts of " + this.txRecords.size() + " TXs");
        return txRecords;
    }

    public List<TxData> deleteReceipts() {
        log.info("Deleting " + this.txRecords.size() + " receipts");
        LinkedList<TxData> receipts = this.txRecords;
        this.txRecords = null;
        return receipts;
    }

    private BigInteger getNonceAndIncrement() {
        synchronized (nonceLock) {
            BigInteger nonce = this.currentNonce;
            this.currentNonce = this.currentNonce.add(BigInteger.ONE);
            return nonce;
        }
    }

    private void fetchCurrentNonce() throws IOException {
        this.currentNonce = this.config.getWeb3jInstance()
                .ethGetTransactionCount(this.config.getCredentials().getAddress(), DefaultBlockParameterName.PENDING)
                .send().getTransactionCount();
        log.info("current nonce: " + this.currentNonce.intValue());
    }

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
