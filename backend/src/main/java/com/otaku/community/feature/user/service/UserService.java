package com.otaku.community.feature.user.service;

import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.common.exception.ConflictException;
import com.otaku.community.common.exception.ResourceNotFoundException;
import com.otaku.community.common.util.SecurityUtils;
import com.otaku.community.feature.user.dto.UpdateUserRequest;
import com.otaku.community.feature.user.dto.UserProfileResponse;
import com.otaku.community.feature.user.dto.UserResponse;
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

    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(UUID userId) {
        User user = userRepository.findByIdAndNotDeleted(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        UserProfileResponse response = userMapper.toProfileResponse(user);
        
        // TODO: Calculate statistics (followers, following, posts)
        response.setFollowersCount(0L);
        response.setFollowingCount(0L);
        response.setPostsCount(0L);
        response.setIsFollowing(false);

        return response;
    }

    @Transactional
    public UserResponse updateUser(UUID userId, UpdateUserRequest request) {
        User user = userRepository.findByIdAndNotDeleted(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

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
        log.info("User updated: {}", savedUser.getId());

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
                userPage.getTotalElements()
        );
    }

    @Transactional(readOnly = true)
    public User findOrCreateUser(String auth0Id, String email, String username) {
        return userRepository.findByAuth0Id(auth0Id)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .auth0Id(auth0Id)
                            .email(email)
                            .username(username)
                            .role(User.UserRole.USER)
                            .build();
                    
                    User savedUser = userRepository.save(newUser);
                    log.info("New user created: {}", savedUser.getId());
                    return savedUser;
                });
    }

    @Transactional
    public User syncUserFromAuth0(String auth0Id, String email, String username, String avatarUrl) {
        return userRepository.findByAuth0Id(auth0Id)
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
                        log.info("User updated during sync: {}", savedUser.getId());
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
                    log.info("New user created during sync: {}", savedUser.getId());
                    return savedUser;
                });
    }

    @Transactional(readOnly = true)
    public User findByAuth0Id() {
        String auth0Id = SecurityUtils.getCurrentAuth0Id();
        return userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "auth0Id", auth0Id));
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
