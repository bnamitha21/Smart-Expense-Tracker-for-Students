package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class ExpensetrackerApplication {

    public static void main(String[] args) {

        // ✅ Load .env ONLY for local (safe for deployment)
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing() // very important
                .load();

        dotenv.entries().forEach(e -> {
            if (System.getProperty(e.getKey()) == null) {
                System.setProperty(e.getKey(), e.getValue());
            }
        });

        SpringApplication.run(ExpensetrackerApplication.class, args);
    }
}