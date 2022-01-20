package approach1.txrequest.web;

import approach1.txrequest.config.AppProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Random;

@Service
@Slf4j
public class DappClient {

    private String txCreationMachineUrl;

    private final WebClient client;
    private final AppProperties properties;

    @Autowired
    public DappClient(WebClient client, AppProperties properties) {
        this.client = client;
        this.properties = properties;
    }

    public void sendTransactionRequest(TxData txData) {
        String url = this.getUrl();
        log.debug("Sending tx request to url " + url);
        this.client.post().uri(url).bodyValue(txData).retrieve().bodyToMono(String.class)
                .subscribe(txHash -> log.info("Submitted transaction with hash " + txHash));
    }

    public String setUrl(String url) {
        this.txCreationMachineUrl = url + "/submit-tx";
        log.info("Set URL for transaction creating machine: " + this.txCreationMachineUrl);
        return this.txCreationMachineUrl;
    }

    public String getUrl() {
        if(this.txCreationMachineUrl == null) {
            this.txCreationMachineUrl = this.properties.txCreationMachineUrl + "/submit-tx";
            log.info("Set URL for transaction creating machine: " + this.txCreationMachineUrl);
        }
        return this.txCreationMachineUrl;
    }
}
