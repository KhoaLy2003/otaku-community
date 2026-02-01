package com.otaku.community.feature.admin.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SystemSettingsDto {
    private boolean maintenanceMode;
    private boolean allowRegistrations;
    private int maxUploadSizeMB;
    private String announcement;
    private boolean announcementActive;
}
