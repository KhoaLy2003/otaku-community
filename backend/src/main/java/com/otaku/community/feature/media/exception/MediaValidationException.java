package com.otaku.community.feature.media.exception;

import com.otaku.community.common.exception.BadRequestException;

public class MediaValidationException extends BadRequestException {
    public MediaValidationException(String message) {
        super(message);
    }
}