package approach1.web;

import approach1.config.Web3jConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.web3j.crypto.Credentials;

@Controller
public class Web3jController {

    private final Web3jConfiguration web3jConfiguration;

    @Autowired
    public Web3jController(Web3jConfiguration web3jConfiguration) {
        this.web3jConfiguration = web3jConfiguration;
    }

    @PostMapping("/setAccount")
    public ResponseEntity<Void> setAccount(@RequestBody String privateKey) {
        web3jConfiguration.credentials = Credentials.create(privateKey);
        return ResponseEntity.noContent().build();
    }


}
