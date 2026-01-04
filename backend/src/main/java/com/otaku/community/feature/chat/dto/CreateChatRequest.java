package com.otaku.community.feature.chat.dto;

import lombok.Getter;

import java.util.UUID;

@Getter
public class CreateChatRequest {
    private UUID userId;
}
