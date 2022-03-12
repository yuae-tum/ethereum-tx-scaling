package txscaling.approach1.middleware;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
@ConfigurationPropertiesScan
public class Approach1MiddlewareApplication {

	public static void main(String[] args) {
		SpringApplication.run(Approach1MiddlewareApplication.class, args);
	}

}
