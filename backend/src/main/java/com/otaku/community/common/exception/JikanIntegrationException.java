package com.otaku.community.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
public class JikanIntegrationException extends RuntimeException {

    public JikanIntegrationException(String message) {
        super(message);
    }

    public JikanIntegrationException(String message, Throwable cause) {
        super(message, cause);
    }
}
