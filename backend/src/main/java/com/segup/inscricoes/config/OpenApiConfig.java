package com.segup.inscricoes.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SEGUP - API de Inscrições")
                        .version("1.0")
                        .description("Sistema de Inscrições da Secretaria de Estado de Segurança Pública e Defesa Social do Pará"));
    }
}
