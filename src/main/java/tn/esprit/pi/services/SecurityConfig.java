package tn.esprit.pi.services;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    //@Bean
    //public PasswordEncoder noOpPasswordEncoder() {
    //    return NoOpPasswordEncoder.getInstance();
    //}
    @Primary

    @Bean(name = "bCryptPasswordEncoder")
    public PasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder(12);    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                          "/users",
                                "/api/auth/login",
                                "/api/auth/register/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/api/auth/**",                                "/api/auth/forgot-password",
                                "/tags/**",
                                "/api/bilans/**",
                                "/api/bilans/**",
                                "/api/categorize**",
                                "/api/chat/**",
                                "/comments/**",
                                "/signal/**",
                                "/rendezVous/**",
                                "/mail/**",
                                "/disease/**",
                                "/consultation/**",
                                "/Commandes/**",
                                "/Fournisseurs/**",
                                "/Medicaments/**",
                                "/stock/**",
                                "/api/discount-requests/**",
                                "/api/email/**",
                                "/api/fraud/**",
                                "/api/ai/**",
                                "/konnect/**",
                                "/leave-requests/**",
                                "/medicalRecord/**",
                                "/api/metrics/**",
                                "/api/v1/notifications/**",
                                "/paiements/",
                                "/content-moderation/**",
                                "/api/auth/**",
                                "/posts/**",
                                "/Prescription/**",
                                "/api/reclamations/**",
                                "/api/users/**",
                          "/users/**",
                                "/api/responses/**",
                                "/api/sms/**",
                          "/api/auth/**",

                                "/users//create-admin"


                        ).permitAll()
                        .requestMatchers("/users/banned-users", "/users/toggle-ban").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .httpBasic(withDefaults());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://198.162.1.118:32584"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
