package txscaling.approach3.txcreation.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.support.atomic.RedisAtomicLong;

@Configuration
public class RedisConfig {

    // provides an interface to fetch the current nonce from the Nonce Manager
    @Bean
    public RedisAtomicLong nonceManager(RedisConnectionFactory connectionFactory) {
        return new RedisAtomicLong("nonce", connectionFactory);
    }

}
