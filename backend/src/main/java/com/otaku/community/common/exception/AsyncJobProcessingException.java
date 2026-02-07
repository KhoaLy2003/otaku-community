package com.otaku.community.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.UUID;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class AsyncJobProcessingException extends RuntimeException {

    private final UUID jobId;

    public AsyncJobProcessingException(UUID jobId, String message) {
        super(message);
        this.jobId = jobId;
    }

    public AsyncJobProcessingException(UUID jobId, String message, Throwable cause) {
        super(message, cause);
        this.jobId = jobId;
    }

    public UUID getJobId() {
        return jobId;
    }
}

