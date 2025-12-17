# Backend Integration Guide for Auth0

This guide explains how to integrate your Java Spring Boot backend with the Auth0-enabled frontend.

## Overview

The frontend uses Auth0 for authentication and sends the Auth0 access token to your backend. Your backend needs to:

1. Validate Auth0 JWT tokens
2. Sync/create users from Auth0 data
3. Protect API endpoints with Auth0 authorization

## Required Dependencies

Add these to your `pom.xml`:

```xml
<dependencies>
    <!-- Auth0 Spring Security -->
    <dependency>
        <groupId>com.auth0</groupId>
        <artifactId>auth0-spring-security-api</artifactId>
        <version>1.5.3</version>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>com.auth0</groupId>
        <artifactId>java-jwt</artifactId>
        <version>4.4.0</version>
    </dependency>
</dependencies>
```

## Configuration

### application.yml

```yaml
auth0:
  audience: https://your-api-identifier
  domain: your-domain.auth0.com
  
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://your-domain.auth0.com/
```

## Security Configuration

Create `SecurityConfig.java`:

```java
package com.otaku.community.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${auth0.audience}")
    private String audience;

    @Value("${auth0.domain}")
    private String domain;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.decoder(jwtDecoder()))
            );

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = JwtDecoders.fromIssuerLocation("https://" + domain + "/");

        OAuth2TokenValidator<Jwt> audienceValidator = new AudienceValidator(audience);
        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer("https://" + domain + "/");
        OAuth2TokenValidator<Jwt> withAudience = new DelegatingOAuth2TokenValidator<>(withIssuer, audienceValidator);

        jwtDecoder.setJwtValidator(withAudience);

        return jwtDecoder;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### Audience Validator

Create `AudienceValidator.java`:

```java
package com.otaku.community.common.config;

import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

public class AudienceValidator implements OAuth2TokenValidator<Jwt> {
    private final String audience;

    public AudienceValidator(String audience) {
        this.audience = audience;
    }

    @Override
    public OAuth2TokenValidatorResult validate(Jwt jwt) {
        if (jwt.getAudience().contains(audience)) {
            return OAuth2TokenValidatorResult.success();
        }

        OAuth2Error error = new OAuth2Error("invalid_token", "The required audience is missing", null);
        return OAuth2TokenValidatorResult.failure(error);
    }
}
```

## User Entity

Update your `User` entity to include Auth0 ID:

```java
package com.otaku.community.feature.user.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String auth0Id;  // Auth0 user ID (sub claim)

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    private String avatar;
    private String bio;
    private String location;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

## User Sync Endpoint

Create the user sync endpoint:

```java
package com.otaku.community.feature.user.controller;

import com.otaku.community.feature.user.dto.UserSyncRequest;
import com.otaku.community.feature.user.entity.User;
import com.otaku.community.feature.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/sync")
    public ResponseEntity<?> syncUser(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody UserSyncRequest request
    ) {
        // Verify the auth0Id matches the JWT subject
        String auth0Id = jwt.getSubject();
        
        if (!auth0Id.equals(request.getAuth0Id())) {
            return ResponseEntity.badRequest().body("Auth0 ID mismatch");
        }

        User user = userService.syncUser(
            request.getAuth0Id(),
            request.getEmail(),
            request.getUsername(),
            request.getAvatar()
        );

        return ResponseEntity.ok(Map.of("data", user));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        String auth0Id = jwt.getSubject();
        User user = userService.findByAuth0Id(auth0Id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(Map.of("data", user));
    }
}
```

### DTOs

```java
package com.otaku.community.feature.user.dto;

import lombok.Data;

@Data
public class UserSyncRequest {
    private String auth0Id;
    private String email;
    private String username;
    private String avatar;
}
```

## User Service

```java
package com.otaku.community.feature.user.service;

import com.otaku.community.feature.user.entity.User;
import com.otaku.community.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public User syncUser(String auth0Id, String email, String username, String avatar) {
        Optional<User> existingUser = userRepository.findByAuth0Id(auth0Id);

        if (existingUser.isPresent()) {
            // Update existing user
            User user = existingUser.get();
            user.setEmail(email);
            user.setUsername(username);
            user.setAvatar(avatar);
            return userRepository.save(user);
        } else {
            // Create new user
            User newUser = new User();
            newUser.setAuth0Id(auth0Id);
            newUser.setEmail(email);
            newUser.setUsername(username);
            newUser.setAvatar(avatar);
            return userRepository.save(newUser);
        }
    }

    public Optional<User> findByAuth0Id(String auth0Id) {
        return userRepository.findByAuth0Id(auth0Id);
    }
}
```

## Repository

```java
package com.otaku.community.feature.user.repository;

import com.otaku.community.feature.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByAuth0Id(String auth0Id);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
}
```

## Getting User Info in Controllers

In any controller, you can get the authenticated user:

```java
@GetMapping("/posts")
public ResponseEntity<?> getPosts(@AuthenticationPrincipal Jwt jwt) {
    String auth0Id = jwt.getSubject();
    String email = jwt.getClaim("email");
    
    // Get user from database
    User user = userService.findByAuth0Id(auth0Id)
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    // Use user for business logic
    List<Post> posts = postService.getPostsByUser(user);
    
    return ResponseEntity.ok(posts);
}
```

## Database Migration

Add migration for auth0_id column:

```sql
-- V2__add_auth0_id.sql
ALTER TABLE users ADD COLUMN auth0_id VARCHAR(255) UNIQUE;
CREATE INDEX idx_users_auth0_id ON users(auth0_id);
```

## Testing

### Test with cURL

```bash
# Get access token from Auth0
TOKEN="your-auth0-access-token"

# Test sync endpoint
curl -X POST http://localhost:8080/api/users/sync \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "auth0Id": "auth0|123456",
    "email": "user@example.com",
    "username": "testuser",
    "avatar": "https://example.com/avatar.jpg"
  }'

# Test get current user
curl http://localhost:8080/api/users/me \
  -H "Authorization: Bearer $TOKEN"
```

## Auth0 API Configuration

In Auth0 Dashboard:

1. Go to Applications > APIs
2. Create a new API or use existing
3. Set Identifier (e.g., `https://api.otaku-community.com`)
4. Enable RBAC if needed
5. Add permissions/scopes as needed

## Environment Variables

Add to your backend `.env` or `application.yml`:

```yaml
auth0:
  audience: ${AUTH0_AUDIENCE:https://api.otaku-community.com}
  domain: ${AUTH0_DOMAIN:your-domain.auth0.com}
```

## Common Issues

### Token validation fails
- Check that `auth0.audience` matches your API identifier in Auth0
- Verify `auth0.domain` is correct
- Ensure frontend is sending the access token, not ID token

### CORS errors
- Add frontend URL to CORS configuration
- Check that credentials are allowed

### User not found
- Ensure `/api/users/sync` is called after Auth0 login
- Check that auth0Id is being stored correctly

## Next Steps

1. Add role-based access control (RBAC)
2. Implement refresh token handling
3. Add user profile update endpoints
4. Implement user search and discovery
5. Add user preferences and settings
