package txscaling.approach1.txcreation.web;

import txscaling.approach1.txcreation.config.AppProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Date;

@Service
@Slf4j
public class MiddlewareClient {

    private String middlewareUrl;

    private final WebClient client;
    private final AppProperties properties;

    @Autowired
    public MiddlewareClient(WebClient client, AppProperties properties) {
        this.client = client;
        this.properties = properties;
    }

    /**
     * forwards a transaction object to the middlware
     * @param txData the transaction object
     */
    public void forwardTxToMiddleware(TxData txData) {
        String url = this.getUrl();
        log.debug("forwarding tx to middleware: " + url);
        String response = this.client.post()
                .uri(url)
                .bodyValue(txData)
                .retrieve()
                .bodyToMono(String.class)
                .defaultIfEmpty("Submitted transaction (created at " + new Date(txData.created) + ")")
                .block();
        log.debug(response);
    }

    /**
     * sets the middleware's URL
     * @param url new URL
     * @return updated URL
     */
    public String setUrl(String url) {
        this.middlewareUrl = url + "/submit-tx";
        log.info("Set URL for middleware: " + this.middlewareUrl);
        return this.middlewareUrl;
    }

    /**
     * returns the middleware's URL
     * @return current URL
     */
    public String getUrl() {
        if(this.middlewareUrl == null) {
            this.middlewareUrl = this.properties.middlewareUrl + "/submit-tx";
            log.info("Set URL for middleware: " + this.middlewareUrl);
        }
        return this.middlewareUrl;
    }
}
