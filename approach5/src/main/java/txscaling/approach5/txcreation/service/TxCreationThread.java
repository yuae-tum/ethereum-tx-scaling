package txscaling.approach5.txcreation.service;

import txscaling.approach5.txcreation.contracts.DappBackend;
import txscaling.approach5.txcreation.config.Web3jConfiguration;
import txscaling.approach5.txcreation.web.TxData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.support.atomic.RedisAtomicLong;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.crypto.RawTransaction;
import org.web3j.tx.RawTransactionManager;

import java.io.IOException;
import java.math.BigInteger;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
public class TxCreationThread extends Thread {

    public boolean createTransactions = true;

    private final RedisAtomicLong nonceManager;
    private final Web3jConfiguration config;
    private final RawTransactionManager transactionManager;

    private final List<TxData> txRecords;

    private final Random random = new Random();
	
    private int numberSentTX = 0;
    private final ScheduledExecutorService threadpool = Executors.newScheduledThreadPool(1);

    public TxCreationThread(RedisAtomicLong nonceManager,
                            Web3jConfiguration config,
                            RawTransactionManager transactionManager,
                            List<TxData> txRecords) {

        this.nonceManager = nonceManager;
        this.config = config;
        this.transactionManager = transactionManager;
        this.txRecords = txRecords;
    }

    @Override
    public void run() {

        // logs number of TX created during the last 5 seconds
        this.threadpool.scheduleAtFixedRate(() -> {
            log.info("created " + this.numberSentTX + " tx requests in 5 seconds");
            this.numberSentTX = 0;
        }, 0, 5, TimeUnit.SECONDS);


        while (true) {
			int machineNum = this.config.getMachineNumber();

			long nonce = this.config.getCurrentNonce();

            // calculate upper bound of the nonce contingent
            long boundary = nonce + this.config.getContingentSize();

            // create transactions until the limit is exhausted
            for (; nonce < boundary; nonce += machineNum) {
                try {
                    this.submitTransaction(nonce);
                    this.numberSentTX++;
                } catch (Exception e) {
                    log.error("error while submitting transaction", e);
                    log.warn("Stopping transaction creation...");
                    this.threadpool.shutdown();
                    return;
                }
            }

            // check if transaction creation should stop
            if (!this.createTransactions) {
                this.threadpool.shutdown();
                return;
            }

			// update nonce
			this.config.setCurrentNonce(nonce);
        }
    }

    /**
     * creates a new transaction and forwards it to the Ethereum Network
     * @param nonce the transaction's nonce
     * @throws IOException if forwarding of the transaction fails
     */
    private void submitTransaction(long nonce) throws IOException {

        TxData txData = new TxData();
        txData.machineId = this.config.getMachineId();
        txData.nonce = nonce;
        txData.content = random.nextInt(100);

        Function function = new Function(
                DappBackend.FUNC_PROCESSTRANSACTION,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Int256(BigInteger.valueOf(txData.content))),
                Collections.emptyList());

        String data = FunctionEncoder.encode(function);

        RawTransaction rawTransaction = RawTransaction.createTransaction(
                BigInteger.valueOf(nonce),
                BigInteger.valueOf(2000000000), //gasPrice
                BigInteger.valueOf(1000000), //gasLimit
                this.config.getSmartContractAddress(), //to
                BigInteger.ZERO, //value
                data
        );

        txData.created = new Date().getTime();
        txData.txhash = this.transactionManager.signAndSend(rawTransaction).getTransactionHash();
        this.txRecords.add(txData);
    }
}
