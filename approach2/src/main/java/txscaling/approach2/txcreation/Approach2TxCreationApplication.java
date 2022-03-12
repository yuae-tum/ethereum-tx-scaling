package txscaling.approach2.txcreation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
@ConfigurationPropertiesScan
public class Approach2TxCreationApplication {

	public static void main(String[] args) {
		SpringApplication.run(Approach2TxCreationApplication.class, args);
	}

}
