package approach2.txcreation.service;

import approach2.txcreation.config.Web3jConfiguration;
import approach2.txcreation.contracts.DappBackend;
import approach2.txcreation.web.TxData;
import lombok.extern.slf4j.Slf4j;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.crypto.RawTransaction;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.tx.RawTransactionManager;

import java.io.IOException;
import java.math.BigInteger;
import java.util.*;

@Slf4j
public class TransactionCreationThread extends Thread {

    public boolean createTransactions = true;

    private final Web3jConfiguration config;
    private final RawTransactionManager transactionManager;
    private BigInteger currentNonce;

    private final List<TxData> txRecords;

    private final Random random = new Random();

    public TransactionCreationThread(Web3jConfiguration config,
                                     RawTransactionManager transactionManager,
                                     BigInteger currentNonce,
                                     List<TxData> txRecords) {

        this.config = config;
        this.transactionManager = transactionManager;
        this.currentNonce = currentNonce;
        this.txRecords = txRecords;
    }

    @Override
    public void run() {
        if(this.config.getInterval() > 0) {
            while (this.createTransactions) {
                try {
                    this.submitTransaction();
                    Thread.sleep(this.config.getInterval());
                } catch (IOException e) {
                    log.error("error while submitting transaction", e);
                    log.warn("Stopping transaction creation...");
                    return;
                } catch (InterruptedException e) {
                    return;
                }
            }
        } else {
            while (this.createTransactions) {
                try {
                    this.submitTransaction();
                } catch (IOException e) {
                    log.error("error while submitting transaction", e);
                    log.warn("Stopping transaction creation...");
                    return;
                }
            }
        }
    }

    private void submitTransaction() throws IOException {

        TxData txData = new TxData();
        txData.nonce = this.currentNonce.intValue();
        txData.content = random.nextInt(100);

        Function function = new Function(
                DappBackend.FUNC_PROCESSTRANSACTION,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Int256(BigInteger.valueOf(txData.content))),
                Collections.emptyList());

        String data = FunctionEncoder.encode(function);

        RawTransaction rawTransaction = RawTransaction.createTransaction(
                this.currentNonce,
                BigInteger.valueOf(2000000000), //gasPrice
                BigInteger.valueOf(1000000), //gasLimit
                this.config.getSmartContractAddress(),
                BigInteger.ZERO, //value
                data);

        txData.created = new Date();
        this.currentNonce = this.currentNonce.add(BigInteger.ONE);
        this.config.getWeb3jInstance().ethSendRawTransaction(this.transactionManager.sign(rawTransaction))
                .sendAsync().thenAccept(tx -> {
                    log.info("{} Transaction submitted, hash: {}", txData.nonce, tx.getTransactionHash());
                    txData.txhash = tx.getTransactionHash();
                    this.txRecords.add(txData);
                });

    }
}
