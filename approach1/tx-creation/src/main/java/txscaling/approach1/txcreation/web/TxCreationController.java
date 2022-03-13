package txscaling.approach1.txcreation.web;

import txscaling.approach1.txcreation.config.AppProperties;
import txscaling.approach1.txcreation.service.TxCreationService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping
public class TxCreationController {

    private final MiddlewareClient client;
    private final TxCreationService service;
    private final AppProperties properties;

    public TxCreationController(MiddlewareClient client, TxCreationService service, AppProperties properties) {
        this.client = client;
        this.service = service;
        this.properties = properties;
    }

    /**
     * Endpoint to request the URL of the Middleware
     * @return current URL
     */
    @GetMapping("/middlewareUrl")
    public ResponseEntity<String> getUrl() {
        return ResponseEntity.ok(this.client.getUrl());
    }


    /**
     * Endpoint to set the URL of the Middleware
     * @param url new URL
     * @return updated URL
     */
    @PostMapping("/middlewareUrl")
    public ResponseEntity<String> setUrl(@RequestBody String url) {
        return ResponseEntity.ok(this.client.setUrl(url));
    }


    /**
     * Endpoint to start transaction creation
     * @return empty
     */
    @GetMapping("/start-tx-creation")
    public ResponseEntity<Void> startTxRequests() {
        this.service.startTransactionRequests();
        return ResponseEntity.noContent().build();
    }


    /**
     * Endpoint to stop transaction creation
     * @return empty
     */
    @GetMapping("/stop-tx-creation")
    public ResponseEntity<Void> stopTxRequests() {
        this.service.stopTransactionRequests();
        return ResponseEntity.noContent().build();
    }


    /**
     * Endpoint to request the machine's id
     * @return id
     */
    @GetMapping("/machineId")
    public ResponseEntity<String> getMachineId() {
        return ResponseEntity.ok(this.properties.machineId);
    }
}
