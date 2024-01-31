package com.example.demo.src.user.config;/*
package com.example.demo.src.user.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.text.DateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;

@Configuration
@EnableCaching
@EnableScheduling
@Slf4j
public class CacheConfig {
    @Bean
    public CacheManager cacheManager() {
        log.debug("[+] CacheConfig Start !!! ");
        return new ConcurrentMapCacheManager("productId");
    }

    @CacheEvict(allEntries = true, value = "productId")
    @Scheduled(fixedDelay = 10000 ,  initialDelay = 500)
    public void reportCacheEvict() {
        System.out.println("Flush Cache " + LocalDateTime.now());
    }}
*/
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class RedisConfig {

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory("redisHost", 6379); // 여러 다른 Redis 연결 방법이 있을 수 있습니다.
    }

    @Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());
        return template;
    }

    @Bean
    public RedisCacheManager redisCacheManager(RedisTemplate<String, String> redisTemplate) {
        RedisCacheConfiguration cacheConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))
                .disableCachingNullValues();

        return RedisCacheManager.builder(redisTemplate.getConnectionFactory())
                .cacheDefaults(cacheConfig)
                .build();
    }

    /*@Bean
    public Map<String, RedisCacheManager> redisCacheManagers() {
        // 여러 RedisCacheManager를 저장할 Map
        Map<String, RedisCacheManager> redisCacheManagers = new HashMap<>();
        redisCacheManagers.put("appProducts", redisCacheManager(redisTemplate(redisConnectionFactory())));
        redisCacheManagers.put("appUsers", redisCacheManager(redisTemplate(redisConnectionFactory())));
        return redisCacheManagers;
    }*/

    @Bean
    public ObjectMapper objectMapper(){
        ObjectMapper mapper = new ObjectMapper();
        return mapper;
    }
}
