package approach1.web;

import approach1.config.Web3jConfiguration;
import approach1.contracts.DappBackend;
import approach1.service.TransactionCreationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.web3j.crypto.Credentials;

import java.io.IOException;
import java.util.List;

@Controller
@Slf4j
public class Web3jController {

    private final Web3jConfiguration config;
    private final TransactionCreationService service;

    @Autowired
    public Web3jController(Web3jConfiguration config, TransactionCreationService service) {
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
    public ResponseEntity<Void> setContractAddress(@RequestBody String contractAddress) {
        this.config.setSmartContractAddress(contractAddress);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/contract")
    public ResponseEntity<DappBackend> getContract() {
        return ResponseEntity.ok(this.config.getSmartContract());
    }

    @PostMapping("/tx-delay")
    public ResponseEntity<String> setTxDelay(@RequestBody int delay) {
        return ResponseEntity.ok("new tx delay: " + this.config.setDelay(delay));
    }

    @GetMapping("/tx-delay")
    public ResponseEntity<String> getTxDelay() {
        return ResponseEntity.ok("tx delay: " + this.config.getDelay());
    }

    @GetMapping("/start-tx-creation")
    public ResponseEntity<Void> startTransactionCreation() {
        this.service.startTransactionCreation();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stop-tx-creation")
    public ResponseEntity<Void> stopTransactionCreation() {
        this.service.stopTransactionCreation();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/receipts")
    public ResponseEntity<List<TxData>> getReceipts() {
        try {
            return ResponseEntity.ok(this.service.collectReceipts());
        } catch (IOException e) {
            log.error("error while collecting receipts", e);
            return ResponseEntity.internalServerError().build();
        }
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
