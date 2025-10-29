package com.rydar.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfiguration {
  @Bean
  public OpenAPI rydarOpenAPI() {
    return new OpenAPI()
        .info(
            new Info()
                .title("Rydar API")
                .description("Backend API documentation for Rydar")
                .version("1.0.0"));
  }
}
