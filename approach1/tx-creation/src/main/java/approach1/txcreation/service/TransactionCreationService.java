package approach1.txcreation.service;

import approach1.txcreation.config.Web3jConfiguration;
import approach1.txcreation.web.TxData;
import approach2.txcreation.contracts.DappBackend;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.crypto.RawTransaction;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthBlock;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.tx.RawTransactionManager;

import java.io.IOException;
import java.math.BigInteger;
import java.util.*;

@Slf4j
@Service
public class TransactionCreationService {

    private final Web3jConfiguration config;
    private RawTransactionManager transactionManager;
    private BigInteger currentNonce = BigInteger.ZERO;

    private LinkedList<TxData> txRecords = new LinkedList<>();
    private LinkedList<EthBlock.Block> minedBlocks = new LinkedList<>();

    private static final Object lock = new Object();

    public TransactionCreationService(Web3jConfiguration config) {
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

    public String submitTransaction(TxData txData) throws IOException {

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
        EthSendTransaction tx = this.getTransactionManager().signAndSend(rawTransaction);

        log.info("Transaction submitted, hash: {}", tx.getTransactionHash());
        txData.txhash = tx.getTransactionHash();
        this.txRecords.add(txData);
        return tx.getTransactionHash();
    }

    public List<TxData> collectReceipts() {
        LinkedList<TxData> receipts = this.txRecords;
        this.txRecords = null;
        return receipts;
    }

    private BigInteger getNonceAndIncrement() {
        synchronized (lock) {
            BigInteger nonce = this.currentNonce;
            this.currentNonce = this.currentNonce.add(BigInteger.ONE);
            return nonce;
        }
    }

    private void fetchCurrentNonce() throws IOException {
        this.currentNonce = this.config.getWeb3jInstance()
                .ethGetTransactionCount(this.config.getCredentials().getAddress(), DefaultBlockParameterName.PENDING)
                .send().getTransactionCount();
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
