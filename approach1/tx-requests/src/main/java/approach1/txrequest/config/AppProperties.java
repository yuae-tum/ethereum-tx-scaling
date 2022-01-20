package approach1.txrequest.config;

import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
@Setter
public class AppProperties {

    public String txCreationMachineUrl;
    public String machineId;
}
