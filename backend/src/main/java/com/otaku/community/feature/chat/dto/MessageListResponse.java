package com.otaku.community.feature.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageListResponse {
    private List<MessageResponse> messages;
    private String nextCursor;
    private boolean hasMore;
    private int totalCount;
}

