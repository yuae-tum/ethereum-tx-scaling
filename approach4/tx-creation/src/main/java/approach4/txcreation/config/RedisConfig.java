package approach4.txcreation.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.support.atomic.RedisAtomicLong;

@Configuration
public class RedisConfig {

    @Bean(name = "nonceManager")
    public RedisAtomicLong nonceManager(RedisConnectionFactory connectionFactory) {
        return new RedisAtomicLong("nonce", connectionFactory);
    }

}
