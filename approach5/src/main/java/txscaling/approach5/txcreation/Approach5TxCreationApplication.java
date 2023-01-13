package txscaling.approach5.txcreation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
@ConfigurationPropertiesScan
public class Approach5TxCreationApplication {

	public static void main(String[] args) {
		SpringApplication.run(Approach5TxCreationApplication.class, args);
	}

}