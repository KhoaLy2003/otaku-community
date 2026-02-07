package com.otaku.community.feature.news.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class CreateRssSourceRequest {
    @NotBlank
    private String name;

    @NotBlank
    @URL
    private String url;

    @NotNull
    private Integer priority;

    private boolean enabled = true;
}
