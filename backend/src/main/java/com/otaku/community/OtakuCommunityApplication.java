package com.otaku.community;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class OtakuCommunityApplication {

    public static void main(String[] args) {
        SpringApplication.run(OtakuCommunityApplication.class, args);
    }
}
