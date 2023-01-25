package txscaling.approach5.txcreation.web;

import txscaling.approach5.txcreation.config.Web3jConfiguration;
import txscaling.approach5.txcreation.service.TxCreationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.web3j.crypto.Credentials;

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
     * Endpoint to synchronize the actual account nonce and the nonce stored at the Nonce Manager
     * @return current nonce
     */
    @GetMapping("/sync-nonce")
    public ResponseEntity<Long> synchronizeNonce() {
        return ResponseEntity.ok(this.service.synchronizeNonce());
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
     * Endpoint to set the nonce contingents' size
     * @param size new size
     * @return updated size
     */
    @PostMapping("/contingent-size")
    public ResponseEntity<Integer> setContingentSize(@RequestBody int size) {
        return ResponseEntity.ok(this.config.setContingentSize(size));
    }


    /**
     * Endpoint to request the current nonce contingents' size
     * @return current size
     */
    @GetMapping("/contingent-size")
    public ResponseEntity<Integer> getContingentSize() {
        return ResponseEntity.ok(this.config.getContingentSize());
    }


    /**
     * Endpoint to start transaction creation
     * @return empty
     */
    @GetMapping("/start-tx-creation/{address}")
    public ResponseEntity<Void> startTransactionCreation(@PathVariable String address) {
        this.service.startTransactionCreation(address);
        return ResponseEntity.noContent().build();
    }


    /**
     * Endpoint to stop transaction creation
     * @return empty
     */
    @GetMapping("/stop-tx-creation")
    public ResponseEntity<Void> stopTransactionCreation() {
        this.service.stopTransactionCreation();
        return ResponseEntity.noContent().build();
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


    /**
     * Endpoint to request the machine's id
     * @return id
     */
    @GetMapping("/machineId")
    public ResponseEntity<String> getMachineId() {
        return ResponseEntity.ok(this.config.getMachineId());
    }

	@PostMapping("/register/{index}")
    public ResponseEntity<Integer> sregisterMachine(@PathVariable int index, @RequestBody int num) {
        return ResponseEntity.ok(this.config.registerMachine(index, num));
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
