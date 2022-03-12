package txscaling.approach1.txcreation.config;

import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
@Setter
public class AppProperties {

    public String middlewareUrl;
    public String machineId;
}
