package com.otaku.community.feature.news.dto;

import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class UpdateRssSourceRequest {
    private String name;

    @URL
    private String url;

    private Integer priority;

    private Boolean enabled;
}
