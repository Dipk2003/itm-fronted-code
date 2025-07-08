package com.indiantrademart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
public class IndianTradeMartApplication {
    public static void main(String[] args) {
        SpringApplication.run(IndianTradeMartApplication.class, args);
    }
}
