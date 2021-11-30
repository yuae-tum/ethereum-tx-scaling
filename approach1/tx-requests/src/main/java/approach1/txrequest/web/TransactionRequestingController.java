package approach1.txrequest.web;

import approach1.txrequest.service.TransactionRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping
public class TransactionRequestingController {

    private final DappClient client;
    private final TransactionRequestService service;

    public TransactionRequestingController(DappClient client, TransactionRequestService service) {
        this.client = client;
        this.service = service;
    }

    @GetMapping("/txCreationMachineUrl")
    public ResponseEntity<String> getUrl() {
        return ResponseEntity.ok(this.client.getUrl());
    }

    @PostMapping("/txCreationMachineUrl")
    public ResponseEntity<String> setUrl(@RequestBody String url) {
        return ResponseEntity.ok(this.client.setUrl(url));
    }

    @GetMapping("/tx-interval")
    public ResponseEntity<Integer> getInterval() {
        return ResponseEntity.ok(this.service.getInterval());
    }

    @PostMapping("/tx-interval")
    public ResponseEntity<Integer> setInterval(@RequestBody int interval) {
        return ResponseEntity.ok(this.service.setInterval(interval));
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
}
