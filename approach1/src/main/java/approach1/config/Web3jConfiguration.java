package approach1.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.crypto.ContractUtils;
import org.web3j.crypto.Credentials;
import org.web3j.ens.Contracts;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.websocket.WebSocketService;
import org.web3j.tx.Contract;

@Configuration
public class Web3jConfiguration {

    @Value("${app.privateKey}")
    public String privateKey;

    @Value("${app.nodeUrl}")
    public String nodeUrl;

    public Credentials credentials;
    public Web3j web3j;

    public Web3jConfiguration() {
        this.credentials = Credentials.create(this.privateKey);
        this.web3j = Web3j.build(new WebSocketService(nodeUrl, true));
    }

    @Bean
    public Web3j getWeb3jInstance() {
        return this.web3j;
    }

    public void getSmartContract() {
    }
}
