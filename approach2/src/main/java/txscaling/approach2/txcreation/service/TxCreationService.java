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
    //private Disposable blockListener;

    private LinkedList<TxData> txRecords = new LinkedList<>();
    //private LinkedList<EthBlock.Block> minedBlocks = new LinkedList<>();

    @Autowired
    public TxCreationService(Web3jConfiguration config) {
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

        /*if(this.blockListener == null || this.blockListener.isDisposed()) {
            this.blockListener = this.config.getWeb3jInstance().blockFlowable(false).subscribe(block -> {
                log.info("new block with number {} mined", block.getBlock().getNumber().toString());
                this.minedBlocks.add(block.getBlock());
            }, error -> {
                log.error("error while listening for new blocks", error);
                this.blockListener.dispose();
            });
        }*/

        try {
            this.fetchCurrentNonce();
            this.txCreationThread = new TxCreationThread(this.config, this.getTransactionManager(), this.currentNonce, this.txRecords);
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

    public List<TxData> collectReceipts() {
        log.info("collecting receipts of " + this.txRecords.size() + " TXs");
        return this.txRecords;

        /*this.blockListener.dispose();

        HashMap<String, Tuple2<Integer, Long>> blockData = new HashMap<>();
        this.minedBlocks.forEach(block -> {
            Tuple2<Integer, Long> numberAndTimestamp = Tuples.of(block.getNumber().intValue(), block.getTimestamp().longValue() * 1000);
            block.getTransactions().forEach(tx -> blockData.put(((EthBlock.TransactionHash) tx).get(), numberAndTimestamp));
        });

        for(TxData txData : this.txRecords) {
            Tuple2<Integer, Long> numberAndTimestamp = blockData.get(txData.txhash);
            if(numberAndTimestamp != null) {
                txData.blocknumber = numberAndTimestamp.getT1();
                txData.mined = numberAndTimestamp.getT2();
                txData.succeeded = true;
                txData.waitingTime = txData.mined - txData.created;
            }
        }

        List<TxData> result = this.txRecords;
        this.minedBlocks = new LinkedList<>();
        this.txRecords = new LinkedList<>();

        return result;*/
    }

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
