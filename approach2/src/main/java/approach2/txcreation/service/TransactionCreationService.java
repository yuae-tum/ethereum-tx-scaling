package approach2.txcreation.service;

import approach2.txcreation.web.TxData;
import approach2.txcreation.config.Web3jConfiguration;
import io.reactivex.disposables.Disposable;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthBlock;
import org.web3j.tx.RawTransactionManager;
import reactor.util.function.Tuple2;
import reactor.util.function.Tuples;

import java.io.IOException;
import java.math.BigInteger;
import java.util.*;

@Service
@Slf4j
public class TransactionCreationService {

    private final Web3jConfiguration config;
    private RawTransactionManager transactionManager;
    private BigInteger currentNonce = BigInteger.ZERO;

    private TransactionCreationThread txCreationThread;
    private Disposable blockListener;

    private LinkedList<TxData> txRecords = new LinkedList<>();
    private LinkedList<EthBlock.Block> minedBlocks = new LinkedList<>();

    @Autowired
    public TransactionCreationService(Web3jConfiguration config) {
        this.config = config;
    }

    public String getNodeVersion() {
        Web3j web3j = this.config.getWeb3jInstance();
        try {
            return web3j.web3ClientVersion().send().getWeb3ClientVersion();
        } catch (IOException e) {
            e.printStackTrace();
            throw new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public void startTransactionCreation() {

        if(this.txCreationThread != null && this.txCreationThread.isAlive()) {
            log.error("cannot start transaction creation: already running");
            throw new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if(this.blockListener == null || this.blockListener.isDisposed()) {
            this.blockListener = this.config.getWeb3jInstance().blockFlowable(false).subscribe(block -> {
                log.info("new block with number {} mined", block.getBlock().getNumber().toString());
                this.minedBlocks.add(block.getBlock());
            }, error -> {
                log.error("error while listening for new blocks", error);
                this.blockListener.dispose();
            });
        }

        try {
            this.fetchCurrentNonce();
            this.txCreationThread = new TransactionCreationThread(this.config, this.getTransactionManager(), this.currentNonce, this.txRecords);
            this.txCreationThread.start();
        } catch (IOException e) {
            log.error("Error while fetching nonce", e);
        }
    }

    public void stopTransactionCreation() {
        if(this.txCreationThread != null) {
            this.txCreationThread.createTransactions = false;
        }
    }

    public List<TxData> collectReceipts() throws IOException {

        this.blockListener.dispose();

        HashMap<String, Tuple2<Integer, Date>> blockData = new HashMap<>();
        this.minedBlocks.forEach(block -> {
            Tuple2<Integer, Date> numberAndTimestamp = Tuples.of(block.getNumber().intValue(),
                    new Date(block.getTimestamp().longValue() * 1000));
            block.getTransactions().forEach(tx -> blockData.put(((EthBlock.TransactionHash) tx).get(), numberAndTimestamp));
        });

        for(TxData txData : this.txRecords) {
            Tuple2<Integer, Date> numberAndTimestamp = blockData.get(txData.txhash);
            if(numberAndTimestamp != null) {
                txData.blocknumber = numberAndTimestamp.getT1();
                txData.mined = numberAndTimestamp.getT2();
                txData.succeeded = true;
                txData.waitingTime = txData.mined.getTime() - txData.created.getTime();
            }
        }

        List<TxData> result = this.txRecords;
        this.minedBlocks = new LinkedList<>();
        this.txRecords = new LinkedList<>();

        return result;
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
