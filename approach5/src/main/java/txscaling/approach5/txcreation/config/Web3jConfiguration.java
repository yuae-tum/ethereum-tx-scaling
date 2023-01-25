package txscaling.approach5.txcreation.config;

import txscaling.approach5.txcreation.contracts.DappBackend;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.support.atomic.RedisAtomicLong;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.StaticGasProvider;

import java.io.IOException;
import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class Web3jConfiguration {

    private final AppProperties appProperties;

    private Credentials credentials;
    private Web3j web3jInstance;
    private DappBackend contract;
    private int contingentSize = -1;

    private final ContractGasProvider gasProvider = new StaticGasProvider(BigInteger.ONE, BigInteger.valueOf(999999999));

	//new var for approach 5
	private int machineNumber;
	private int order;
	private long currentNonce;

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
     * returns the nonce contingents' size
     * @return current size
     */
    public int getContingentSize() {
        if(this.contingentSize == -1) {
            this.contingentSize = this.appProperties.contingentSize;
            log.info("nonce contingent size: " + this.contingentSize);
        }
        if(this.contingentSize < 1) {
            throw new RuntimeException("nonce contingent size can not be smaller than 1 ms");
        }
        return this.contingentSize;
    }

    /**
     * updates the nonce contingents' size
     * @param newSize new size
     * @return updated size
     */
    public int setContingentSize(int newSize) {
        if(newSize < 1) {
            throw new RuntimeException("nonce contingent size can not be smaller than 1 ms");
        }
        this.contingentSize = newSize;
        log.info("nonce contingent size: " + this.contingentSize);

        return this.contingentSize;
    }

    /**
     * returns the machine's id
     * @return id
     */
    public String getMachineId() {
        return this.appProperties.machineId;
    }

	/**
	 * 
	 * functions for approach 5
	 * 
	 */
	public int registerMachine(int index, int num) {
		this.order = index;
		this.machineNumber = num;
		log.info("total tx machine: " + this.machineNumber);
		this.currentNonce = this.order;
		log.info("machine index: " + this.order);
		log.info("current nonce: " + this.currentNonce);
        return this.order;
	}

	public int getMachineNumber() {
		return this.machineNumber;
	}

	public int getOrder(String address) {
		return this.order;
	}

	public void setCurrentNonce(long nonce) {
		this.currentNonce = nonce;
	}

	public long getCurrentNonce() {
		return this.currentNonce;
	}
}

