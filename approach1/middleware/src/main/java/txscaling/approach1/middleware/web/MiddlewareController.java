package txscaling.approach1.middleware.web;

import txscaling.approach1.middleware.config.Web3jConfiguration;
import txscaling.approach1.middleware.service.MiddlewareService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.web3j.crypto.Credentials;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping
@Slf4j
public class MiddlewareController {

    private final Web3jConfiguration config;
    private final MiddlewareService service;

    @Autowired
    public MiddlewareController(Web3jConfiguration config, MiddlewareService service) {
        this.config = config;
        this.service = service;
    }

    /**
     * Endpoint to request the current version of the Ethereum Node;
     * can be used to check if the transaction-creating machine is connected to a node
     * @return Ethereum node version
     */
    @GetMapping("/node-version")
    public ResponseEntity<String> getNodeVersion() {
        return ResponseEntity.ok(this.service.getNodeVersion());
    }


    /**
     * Endpoint to set the Ethereum account that should be used to issue transactions
     * @param privateKey the account's private key
     * @return new account
     */
    @PostMapping("/account")
    public ResponseEntity<Account> setAccount(@RequestBody String privateKey) {
        Credentials credentials = this.config.setCredentials(privateKey);
        return ResponseEntity.ok(new Account(
                credentials.getEcKeyPair().getPrivateKey().toString(16),
                credentials.getEcKeyPair().getPublicKey().toString(16),
                credentials.getAddress()));
    }


    /**
     * Endpoint to request the current Ethereum account that is used to issue transactions
     * @return current account
     */
    @GetMapping("/account")
    public ResponseEntity<Account> getAccount() {
        Credentials credentials = this.config.getCredentials();
        return ResponseEntity.ok(new Account(
                credentials.getEcKeyPair().getPrivateKey().toString(16),
                credentials.getEcKeyPair().getPublicKey().toString(16),
                credentials.getAddress()));
    }


    /**
     * Endpoint to set the address of the Smart Contract
     * @param contractAddress new contract address
     * @return updated contract address
     */
    @PostMapping("/contract")
    public ResponseEntity<String> setContractAddress(@RequestBody String contractAddress) {
        return ResponseEntity.ok(this.config.setSmartContractAddress(contractAddress));
    }


    /**
     * Endpoint to request the address of the Smart Contract
     * @return current contract address
     */
    @GetMapping("/contract")
    public ResponseEntity<String> getContractAddress() {
        return ResponseEntity.ok(this.config.getSmartContractAddress());
    }


    /**
     * Endpoint to submit a new transaction for setting the nonce and forwarding it to the Ethereum Node
     * @param txData the transaction
     * @return empty
     */
    @PostMapping("/submit-tx")
    public ResponseEntity<Void> submitTransaction(@RequestBody TxData txData) {
        try {
            this.service.submitTransaction(txData);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            log.error("error during transaction creation", e);
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }


    /**
     * Endpoint to collect data about the created transactions
     * @return List of transaction information
     */
    @GetMapping("/receipts")
    public ResponseEntity<List<TxData>> getReceipts() {
        return ResponseEntity.ok(this.service.collectReceipts());
    }


    /**
     * Endpoint to clear data about the created transactions
     * @return List of transaction information
     */
    @DeleteMapping("/receipts")
    public ResponseEntity<List<TxData>> deleteReceipts() {
        return ResponseEntity.ok(this.service.deleteReceipts());
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
