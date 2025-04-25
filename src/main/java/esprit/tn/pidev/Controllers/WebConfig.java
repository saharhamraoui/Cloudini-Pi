package esprit.tn.pidev.Controllers;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // Indique que cette classe contient des configurations globales
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Autorise toutes les routes ("/**")
                        .allowedOrigins("http://localhost:4200") // Autorise les requêtes depuis ce domaine
                        .allowedMethods("GET", "POST", "PUT", "DELETE") // Autorise ces méthodes HTTP
                        .allowedHeaders("*") // Autorise tous les headers
                        .allowCredentials(true); // Autorise les cookies ou les sessions si nécessaire
            }
        };
    }
}