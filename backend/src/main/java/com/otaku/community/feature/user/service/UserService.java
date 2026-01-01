package com.otaku.community.feature.user.service;

import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.common.exception.ConflictException;
import com.otaku.community.common.exception.ResourceNotFoundException;
import com.otaku.community.common.util.SecurityUtils;
import com.otaku.community.feature.post.repository.PostRepository;
import com.otaku.community.feature.user.dto.UpdateUserRequest;
import com.otaku.community.feature.user.dto.UserProfileResponse;
import com.otaku.community.feature.user.dto.UserResponse;
import com.otaku.community.feature.user.dto.UserSyncResponse;
import com.otaku.community.feature.user.entity.User;
import com.otaku.community.feature.user.mapper.UserMapper;
import com.otaku.community.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final UserFollowService userFollowService;
    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfileByUsername(String username) {
        User user = userRepository.findByUsernameAndNotDeleted(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        return getProfileResponse(user);
    }

    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        return userRepository.findByUsernameAndNotDeleted(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    private UserProfileResponse getProfileResponse(User user) {
        UserProfileResponse response = userMapper.toProfileResponse(user);

        response.setFollowersCount(userFollowService.getFollowersCount(user.getId()));
        response.setFollowingCount(userFollowService.getFollowingCount(user.getId()));
        response.setPostsCount(postRepository.countByUserIdAndNotDeleted(user.getId()));

        String auth0Id = SecurityUtils.getCurrentAuth0Id();
        User currentUser = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "auth0Id", auth0Id));
        response.setIsFollowing(userFollowService.isFollowing(currentUser.getId(), user.getId()));

        return response;
    }

    @Transactional
    public UserResponse updateUser(UpdateUserRequest request) {
        String auth0Id = SecurityUtils.getCurrentAuth0Id();
        User user = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "auth0Id", auth0Id));

        // Check username uniqueness if changed
        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new ConflictException("Username already taken");
            }
            user.setUsername(request.getUsername());
        }

        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        if (request.getInterests() != null) {
            user.setInterests(request.getInterests());
        }

        if (request.getLocation() != null) {
            user.setLocation(request.getLocation());
        }

        User savedUser = userRepository.save(user);
        log.debug("User updated: {}", savedUser.getId());

        return userMapper.toResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> searchUsers(String query, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<User> userPage = userRepository.searchByUsername(query, pageable);

        return PageResponse.of(
                userPage.getContent().stream()
                        .map(userMapper::toResponse)
                        .toList(),
                page,
                limit,
                userPage.getTotalElements());
    }

    @Transactional
    public UserSyncResponse syncUserFromAuth0(String auth0Id, String email, String username, String avatarUrl) {
        User syncedUser = userRepository.findByAuth0Id(auth0Id)
                .map(existingUser -> {
                    // Update existing user with latest Auth0 data
                    boolean updated = false;

                    if (!email.equals(existingUser.getEmail())) {
                        // Check if new email is already taken by another user
                        if (userRepository.existsByEmail(email)) {
                            log.warn("Email {} already exists for another user during sync for auth0Id: {}",
                                    email, auth0Id);
                        } else {
                            existingUser.setEmail(email);
                            updated = true;
                        }
                    }

                    if (!username.equals(existingUser.getUsername())) {
                        // Generate unique username if taken
                        String uniqueUsername = generateUniqueUsername(username, existingUser.getId());
                        existingUser.setUsername(uniqueUsername);
                        updated = true;
                    }

                    if (avatarUrl != null && !avatarUrl.equals(existingUser.getAvatarUrl())) {
                        existingUser.setAvatarUrl(avatarUrl);
                        updated = true;
                    }

                    if (updated) {
                        User savedUser = userRepository.save(existingUser);
                        log.debug("User updated during sync: {}", savedUser.getId());
                        return savedUser;
                    }

                    return existingUser;
                })
                .orElseGet(() -> {
                    // Create new user
                    String uniqueUsername = generateUniqueUsername(username, null);

                    User newUser = User.builder()
                            .auth0Id(auth0Id)
                            .email(email)
                            .username(uniqueUsername)
                            .avatarUrl(avatarUrl)
                            .role(User.UserRole.USER)
                            .build();

                    User savedUser = userRepository.save(newUser);
                    log.debug("New user created during sync: {}", savedUser.getId());
                    return savedUser;
                });

        return userMapper.toSyncResponse(syncedUser);
    }

    @Transactional(readOnly = true)
    public User findByAuth0Id() {
        String auth0Id = SecurityUtils.getCurrentAuth0Id();
        return userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "auth0Id", auth0Id));
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUserResponse() {
        String auth0Id = SecurityUtils.getCurrentAuth0Id();
        User user = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "auth0Id", auth0Id));

        return userMapper.toResponse(user);
    }

    @Transactional(readOnly = true)
    public Optional<User> findByAuth0IdOptional(String auth0Id) {
        return userRepository.findByAuth0Id(auth0Id);
    }

    private String generateUniqueUsername(String baseUsername, UUID excludeUserId) {
        String username = baseUsername;
        int counter = 1;

        while (isUsernameTaken(username, excludeUserId)) {
            username = baseUsername + counter;
            counter++;

            // Prevent infinite loop
            if (counter > 1000) {
                username = baseUsername + System.currentTimeMillis();
                break;
            }
        }

        return username;
    }

    private boolean isUsernameTaken(String username, UUID excludeUserId) {
        return userRepository.findByUsername(username)
                .map(user -> !user.getId().equals(excludeUserId))
                .orElse(false);
    }
}
