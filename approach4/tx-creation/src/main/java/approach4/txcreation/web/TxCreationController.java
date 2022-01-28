package approach4.txcreation.web;

import approach4.txcreation.config.Web3jConfiguration;
import approach4.txcreation.service.TxCreationService;
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
public class TxCreationController {

    private final TxCreationService service;
    private final Web3jConfiguration config;

    @Autowired
    public TxCreationController(TxCreationService service, Web3jConfiguration config) {
        this.service = service;
        this.config = config;
    }

    @GetMapping("/node-version")
    public ResponseEntity<String> getNodeVersion() {
        return ResponseEntity.ok(this.service.getNodeVersion());
    }

    @GetMapping("/sync-nonce")
    public ResponseEntity<Long> synchronizeNonce() {
        return ResponseEntity.ok(this.service.synchronizeNonce());
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

    @PostMapping("/contingent-size")
    public ResponseEntity<Integer> setContingentSize(@RequestBody int size) {
        return ResponseEntity.ok(this.config.setContingentSize(size));
    }

    @GetMapping("/contingent-size")
    public ResponseEntity<Integer> getContingentSize() {
        return ResponseEntity.ok(this.config.getContingentSize());
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

    @GetMapping("/machineId")
    public ResponseEntity<String> getMachineId() {
        return ResponseEntity.ok(this.config.getMachineId());
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
