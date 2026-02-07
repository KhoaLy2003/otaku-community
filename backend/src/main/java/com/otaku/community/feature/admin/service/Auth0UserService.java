package com.otaku.community.feature.admin.service;

import com.otaku.community.common.service.Auth0TokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class Auth0UserService {

    private final Auth0TokenService tokenService;
    private final RestTemplate restTemplate;
    @Value("${auth0.domain}")
    private String domain;

    public Auth0UserService(Auth0TokenService tokenService,
                            RestTemplateBuilder builder) {
        this.restTemplate = builder
                .requestFactory(HttpComponentsClientHttpRequestFactory.class)
                .build();
        this.tokenService = tokenService;
    }

    public void blockUser(String auth0UserId) {

        Map<String, Object> body = Map.of("blocked", true);

        callAuth0Api(
                "/api/v2/users/" + auth0UserId,
                HttpMethod.PATCH,
                body
        );
    }

    public void unblockUser(String auth0UserId) {

        Map<String, Object> body = Map.of("blocked", false);

        callAuth0Api(
                "/api/v2/users/" + auth0UserId,
                HttpMethod.PATCH,
                body
        );
    }

    private <T> void callAuth0Api(
            String endpoint,
            HttpMethod method,
            T body
    ) {

        String token = tokenService.getManagementToken();

        String url = "https://" + domain + endpoint;

        HttpHeaders headers = buildAuth0Headers(token);

        HttpEntity<T> request = new HttpEntity<>(body, headers);

        try {
            restTemplate.exchange(
                    url,
                    method,
                    request,
                    String.class
            );
        } catch (RestClientException ex) {
            throw new RuntimeException("Auth0 API call failed: " + endpoint, ex);
        }
    }

    private HttpHeaders buildAuth0Headers(String token) {

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        return headers;
    }
}
