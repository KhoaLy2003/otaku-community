package com.otaku.community.feature.activity.mapper;

import com.otaku.community.feature.activity.dto.ActivityLogResponse;
import com.otaku.community.feature.activity.dto.LoginHistoryResponse;
import com.otaku.community.feature.activity.entity.ActivityLog;
import com.otaku.community.feature.activity.entity.LoginHistory;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ActivityMapper {

    LoginHistoryResponse toLoginHistoryResponse(LoginHistory loginHistory);

    ActivityLogResponse toActivityLogResponse(ActivityLog activityLog);
}
