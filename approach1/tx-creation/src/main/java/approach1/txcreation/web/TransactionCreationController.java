package approach1.txcreation.web;

import approach1.txcreation.config.Web3jConfiguration;
import approach1.txcreation.service.TransactionCreationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.web3j.crypto.Credentials;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping
@Slf4j
public class TransactionCreationController {

    private final Web3jConfiguration config;
    private final TransactionCreationService service;

    @Autowired
    public TransactionCreationController(Web3jConfiguration config, TransactionCreationService service) {
        this.config = config;
        this.service = service;
    }

    @GetMapping("/node-version")
    public ResponseEntity<String> getNodeVersion() {
        return ResponseEntity.ok(this.service.getNodeVersion());
    }

    @PostMapping("/account")
    public ResponseEntity<Account> setAccount(@RequestBody String privateKey) {
        Credentials credentials = this.config.setCredentials(privateKey);
        return ResponseEntity.ok(new Account(
                credentials.getEcKeyPair().getPrivateKey().toString(16),
                credentials.getEcKeyPair().getPublicKey().toString(16),
                credentials.getAddress()));
    }

    @GetMapping("/account")
    public ResponseEntity<Account> getAccount() {
        Credentials credentials = this.config.getCredentials();
        return ResponseEntity.ok(new Account(
                credentials.getEcKeyPair().getPrivateKey().toString(16),
                credentials.getEcKeyPair().getPublicKey().toString(16),
                credentials.getAddress()));
    }

    @PostMapping("/contract")
    public ResponseEntity<String> setContractAddress(@RequestBody String contractAddress) {
        return ResponseEntity.ok(this.config.setSmartContractAddress(contractAddress));
    }

    @GetMapping("/contract")
    public ResponseEntity<String> getContractAddress() {
        return ResponseEntity.ok(this.config.getSmartContractAddress());
    }

    @PostMapping("/submit-tx")
    public ResponseEntity<String> submitTransaction(@RequestBody TxData txData) {
        try {
            return ResponseEntity.ok(this.service.submitTransaction(txData));
        } catch (IOException e) {
            log.error("error during transaction creation", e);
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/receipts")
    public ResponseEntity<List<TxData>> getReceipts() {
        return ResponseEntity.ok(this.service.collectReceipts());
    }

    private static class Account {
        public String privateKey;
        public String publicKey;
        public String address;

        public Account(String privateKey, String publicKey, String address) {
            this.privateKey = privateKey;
            this.publicKey = publicKey;
            this.address = address;
        }
    }
}
