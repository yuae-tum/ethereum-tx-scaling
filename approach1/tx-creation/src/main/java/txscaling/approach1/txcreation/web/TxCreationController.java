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

    @GetMapping("/txCreationMachineUrl")
    public ResponseEntity<String> getUrl() {
        return ResponseEntity.ok(this.client.getUrl());
    }

    @PostMapping("/txCreationMachineUrl")
    public ResponseEntity<String> setUrl(@RequestBody String url) {
        return ResponseEntity.ok(this.client.setUrl(url));
    }

    @GetMapping("/start-tx-creation")
    public ResponseEntity<Void> startTxRequests() {
        this.service.startTransactionRequests();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stop-tx-creation")
    public ResponseEntity<Void> stopTxRequests() {
        this.service.stopTransactionRequests();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/machineId")
    public ResponseEntity<String> getMachineId() {
        return ResponseEntity.ok(this.properties.machineId);
    }
}
