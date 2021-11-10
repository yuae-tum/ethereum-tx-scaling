package approach1.config;

import approach1.contracts.DappBackend;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.websocket.WebSocketService;
import org.web3j.tx.gas.DefaultGasProvider;

@Component
public class Web3jConfiguration {

    @Value("${app.privateKey}")
    public String privateKey;

    @Value("${app.nodeUrl}")
    public String nodeUrl;

    @Value("$app.contractAddress")
    public String contractAddress;

    public Credentials credentials;
    public Web3j web3jInstance;
    public DappBackend contract;

    public Web3jConfiguration() {
        this.credentials = Credentials.create(this.privateKey);
        this.web3jInstance = Web3j.build(new WebSocketService(nodeUrl, true));
    }

    public Web3j getWeb3jInstance() {
        return this.web3jInstance;
    }

    public DappBackend getSmartContract() {
        if(this.contract == null) {
            this.contract = DappBackend.load(this.contractAddress, this.web3jInstance, this.credentials, new DefaultGasProvider());
        }
        return this.contract;
    }

    public void setSmartContractAddress(String contractAddress) {
        this.contract = DappBackend.load(contractAddress, web3jInstance, credentials, new DefaultGasProvider());
    }
}
