package approach1.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web3j.protocol.Web3j;

@Service
public class TransactionCreation {

    private final Web3j web3j;

    @Autowired
    public TransactionCreation(Web3j web3j) {
        this.web3j = web3j;
    }

    private void getSmartContract() {

    }
}
