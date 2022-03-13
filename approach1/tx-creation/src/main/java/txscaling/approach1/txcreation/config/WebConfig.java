package txscaling.approach1.txcreation.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.config.WebFluxConfigurer;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import reactor.netty.resources.ConnectionProvider;

@Configuration
@EnableWebFlux
public class WebConfig implements WebFluxConfigurer {

    // enables Cross-Origin-Requests
    @Override
    public void addCorsMappings(CorsRegistry corsRegistry) {
        corsRegistry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("*")
                .maxAge(3600);
    }

    // provides web client to communicate with the middleware
    @Bean
    public WebClient getWebclient() {
        // increase maxConnections to 5000 (default 1000)
        HttpClient httpClient = HttpClient.create(
                ConnectionProvider.create("connectionProvider", 5000)
        );
        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}
