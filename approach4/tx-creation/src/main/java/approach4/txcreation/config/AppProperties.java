package approach4.txcreation.config;

import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
@Setter
public class AppProperties {

    public String privateKey;
    public String nodeUrl;
    public String contractAddress;
    public int contingentSize;
    public String machineId;

}
