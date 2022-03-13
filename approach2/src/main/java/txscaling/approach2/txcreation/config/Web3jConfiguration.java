package txscaling.approach2.txcreation.config;

import txscaling.approach2.txcreation.contracts.DappBackend;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.StaticGasProvider;

import java.io.IOException;
import java.math.BigInteger;

@Component
@Slf4j
public class Web3jConfiguration {

    private final AppProperties appProperties;

    private Credentials credentials;
    private Web3j web3jInstance;
    private DappBackend contract;

    private final ContractGasProvider gasProvider = new StaticGasProvider(BigInteger.ONE, BigInteger.valueOf(999999999));

    @Autowired
    public Web3jConfiguration(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    /**
     * returns the web3j instance, creates a new instance if there is non yet;
     * the web3j instance acts as an interface to the Ethereum Node
     * @return the web3j instance
     */
    public Web3j getWeb3jInstance() {
        if(this.web3jInstance == null) {
            System.out.println("node url: " + this.appProperties.nodeUrl);
            try {
                this.web3jInstance = Web3j.build(new HttpService(this.appProperties.nodeUrl));
                log.info("connected to geth node {}, {}", this.appProperties.nodeUrl, this.web3jInstance.web3ClientVersion().send().getWeb3ClientVersion());
            } catch (IOException e) {
                log.error("connection to geth node failed", e);
                this.web3jInstance = null;
            }
        }
        return this.web3jInstance;
    }

    /**
     * returns the web3j-credentials object, creates one if there is non yet;
     * the web3j-credentials object represents the Ethereum account used to issue transactions
     * @return web3j-credentials object
     */
    public Credentials getCredentials() {
        if(this.credentials == null) {
            this.credentials = Credentials.create(this.appProperties.privateKey);
            log.info("using account with address: {},\npublic key: {},\n private key: {}",
                    this.credentials.getAddress(),
                    this.credentials.getEcKeyPair().getPublicKey().toString(16),
                    this.credentials.getEcKeyPair().getPrivateKey().toString(16));
        }
        return this.credentials;
    }

    /**
     * updates the web3j-credentials object, which represents an Ethereum used to issue transactions
     * @param privateKey account's private key
     * @return web3j-credentials object
     */
    public Credentials setCredentials(String privateKey) {
        this.credentials = Credentials.create(privateKey);
        log.info("using account with address: {},\npublic key: {},\nprivate key: {}",
                this.credentials.getAddress(),
                this.credentials.getEcKeyPair().getPublicKey().toString(16),
                this.credentials.getEcKeyPair().getPrivateKey().toString(16));
        // update Contract
        if(this.contract != null) {
            this.contract = DappBackend.load(this.contract.getContractAddress(), this.getWeb3jInstance(), this.getCredentials(), this.gasProvider);
        }

        return this.credentials;
    }

    /**
     * returns the address of the Smart Contract; creates a new representation of the Smart Contract if there is non yet
     * @return address of the Smart Contract
     */
    public String getSmartContractAddress() {
        if(this.contract == null) {
            this.contract = DappBackend.load(this.appProperties.contractAddress, this.getWeb3jInstance(), this.getCredentials(), this.gasProvider);
            log.info("created contract reference to contract at address: " + this.contract.getContractAddress());
        }
        return this.contract.getContractAddress();
    }

    /**
     * updates the address of the Smart Contract
     * @param contractAddress new address
     * @return updated address
     */
    public String setSmartContractAddress(String contractAddress) {
        this.contract = DappBackend.load(contractAddress, this.getWeb3jInstance(), this.getCredentials(), this.gasProvider);
        log.info("created contract reference to contract at address: " + this.contract.getContractAddress());
        return this.contract.getContractAddress();
    }

    /**
     * returns the machine's id
     * @return id
     */
    public String getMachineId() {
        return this.appProperties.machineId;
    }

}
