package esprit.tn.pidev;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PiDevApplication {

  public static void main(String[] args) {
    SpringApplication.run(PiDevApplication.class, args);
  }
}
