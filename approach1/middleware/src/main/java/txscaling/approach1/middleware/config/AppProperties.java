package txscaling.approach1.middleware.config;

import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "eth")
@Setter
public class AppProperties {

    public String privateKey;
    public String nodeUrl;
    public String contractAddress;

}
