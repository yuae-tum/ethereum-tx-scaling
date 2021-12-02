package approach3.txcreation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
@ConfigurationPropertiesScan
public class Approach3TxCreationApplication {

	public static void main(String[] args) {
		SpringApplication.run(Approach3TxCreationApplication.class, args);
	}

}
