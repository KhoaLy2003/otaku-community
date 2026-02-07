package com.otaku.community.feature.user.service;

import com.otaku.community.common.constant.CommonConstant;
import com.otaku.community.common.exception.ResourceNotFoundException;
import com.otaku.community.common.util.SecurityUtils;
import com.otaku.community.feature.activity.entity.ActivityTargetType;
import com.otaku.community.feature.activity.entity.ActivityType;
import com.otaku.community.feature.activity.event.ActivityEvent;
import com.otaku.community.feature.media.dto.MediaUploadResponse;
import com.otaku.community.feature.media.service.MediaService;
import com.otaku.community.feature.user.dto.UpdatePrivacyRequest;
import com.otaku.community.feature.user.dto.UserResponse;
import com.otaku.community.feature.user.entity.User;
import com.otaku.community.feature.user.mapper.UserMapper;
import com.otaku.community.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserSettingService {

    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final UserMapper userMapper;
    private final MediaService mediaService;

    @Transactional
    public UserResponse updateProfileImages(MultipartFile avatarFile, MultipartFile coverFile) {
        String auth0Id = SecurityUtils.getCurrentAuth0Id();
        User user = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new ResourceNotFoundException(CommonConstant.ERR_MSG_USER_NOT_FOUND));

        if (avatarFile != null && !avatarFile.isEmpty()) {
            MediaUploadResponse response = mediaService.uploadMedia(avatarFile);
            user.setAvatarUrl(response.getUrl());
            eventPublisher.publishEvent(new ActivityEvent(user.getId(), ActivityType.UPDATE_PROFILE,
                    ActivityTargetType.USER, user.getId().toString(), "Avatar updated"));
        }

        if (coverFile != null && !coverFile.isEmpty()) {
            MediaUploadResponse response = mediaService.uploadMedia(coverFile);
            user.setCoverImageUrl(response.getUrl());
            eventPublisher.publishEvent(new ActivityEvent(user.getId(), ActivityType.UPDATE_PROFILE,
                    ActivityTargetType.USER, user.getId().toString(), "Cover image updated"));
        }

        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    @Transactional
    public UserResponse updatePrivacy(UpdatePrivacyRequest request) {
        String auth0Id = SecurityUtils.getCurrentAuth0Id();
        User user = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new ResourceNotFoundException(CommonConstant.ERR_MSG_USER_NOT_FOUND));

        user.setProfileVisibility(request.getProfileVisibility());
        eventPublisher
                .publishEvent(new ActivityEvent(user.getId(), ActivityType.UPDATE_PROFILE, ActivityTargetType.USER,
                        user.getId().toString(), "Profile visibility changed to " + request.getProfileVisibility()));

        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }
}
