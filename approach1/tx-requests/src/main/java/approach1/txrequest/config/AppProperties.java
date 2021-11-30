package approach1.txrequest.config;

import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "eth")
@Setter
public class AppProperties {

    public String txCreationMachineUrl;
    public int requestInterval;
}
