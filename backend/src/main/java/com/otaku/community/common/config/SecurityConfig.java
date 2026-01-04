package com.otaku.community.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    // @Value("${auth0.audience}")
    // private String audience;
    //
    @Value("${auth0.domain}")
    private String domain;

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // JwtWebSecurityConfigurer
        // .forRS256(audience, String.format("https://%s/", domain))
        // .configure(http)
        // .csrf(AbstractHttpConfigurer::disable)
        // .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        // //.oauth2Login(Customizer.withDefaults())
        // .sessionManagement(session ->
        // session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        // .authorizeHttpRequests(auth -> auth
        // // Public endpoints
        // .requestMatchers(HttpMethod.GET, "/health", "/docs/**",
        // "/swagger-ui/**").permitAll()
        // .requestMatchers(HttpMethod.GET, "/posts/**", "/topics/**",
        // "/users/**").permitAll()
        // .requestMatchers(HttpMethod.GET, "/feed/explore").permitAll()
        //
        // // Authenticated endpoints
        // .requestMatchers("/posts/**", "/comments/**", "/likes/**").authenticated()
        // .requestMatchers("/feed/home", "/feed/following").authenticated()
        // .requestMatchers("/notifications/**").authenticated()
        // .requestMatchers("/users/me/**").authenticated()
        //
        // // Admin endpoints
        // .requestMatchers("/admin/**").hasAuthority("ROLE_ADMIN")
        //
        // // All other requests require authentication
        // .anyRequest().authenticated()
        // );
        //
        // return http.build();

        return http
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers(HttpMethod.GET, "/health", "/docs/**", "/swagger-ui/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/feed/explore/**").permitAll()
                        .requestMatchers("/api/ws-registry/**", "/ws-registry/**", "/ws-native/**").permitAll()

                        // Authenticated endpoints
                        .requestMatchers("/posts/**", "/comments/**", "/likes/**").authenticated()
                        .requestMatchers("/feed/home", "/feed/following").authenticated()
                        .requestMatchers("/notifications/**").authenticated()
                        .requestMatchers("/users/me/**").authenticated()
                        .requestMatchers("/api/v1/chats/**").authenticated()

                        // Admin endpoints
                        .requestMatchers("/admin/**").hasAuthority("ROLE_ADMIN")

                        // All other requests require authentication
                        .anyRequest().authenticated())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(withDefaults()))
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return JwtDecoders.fromIssuerLocation("https://" + domain + "/");
    }
}
