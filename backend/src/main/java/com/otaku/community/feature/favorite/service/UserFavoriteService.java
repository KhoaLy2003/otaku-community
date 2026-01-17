package com.otaku.community.feature.favorite.service;

import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.common.exception.BadRequestException;
import com.otaku.community.common.exception.ResourceNotFoundException;
import com.otaku.community.common.util.PaginationUtils;
import com.otaku.community.feature.favorite.dto.CreateFavoriteRequest;
import com.otaku.community.feature.favorite.dto.FavoriteResponse;
import com.otaku.community.feature.favorite.dto.UpdateFavoriteRequest;
import com.otaku.community.feature.favorite.entity.UserFavorite;
import com.otaku.community.feature.favorite.mapper.UserFavoriteMapper;
import com.otaku.community.feature.favorite.repository.UserFavoriteRepository;
import com.otaku.community.feature.user.entity.User;
import com.otaku.community.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserFavoriteService {

    private final UserFavoriteRepository userFavoriteRepository;
    private final UserRepository userRepository;
    private final UserFavoriteMapper userFavoriteMapper;

    /**
     * Add a new favorite item for the user
     */
    @Transactional
    public FavoriteResponse addFavorite(UUID userId, CreateFavoriteRequest request) {
        log.debug("Adding favorite for user {}: {}", userId, request.getTitle());

        // Verify user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check for duplicates
        if (userFavoriteRepository.existsByUserIdAndTypeAndExternalId(userId, request.getType(),
                request.getExternalId())) {
            throw new BadRequestException("This item is already in your favorites list");
        }

        UserFavorite userFavorite = userFavoriteMapper.toEntity(request);
        userFavorite.setUser(user);

        UserFavorite savedFavorite = userFavoriteRepository.save(userFavorite);
        return userFavoriteMapper.toResponse(savedFavorite);
    }

    /**
     * Remove a favorite item
     */
    @Transactional
    public void removeFavorite(UUID userId, UUID favoriteId) {
        log.debug("Removing favorite {} for user {}", favoriteId, userId);

        UserFavorite favorite = userFavoriteRepository.findByIdAndUserId(favoriteId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite not found or does not belong to you"));

        userFavoriteRepository.delete(favorite);
    }

    /**
     * Update a favorite item (e.g. note)
     */
    @Transactional
    public FavoriteResponse updateFavorite(UUID userId, UUID favoriteId, UpdateFavoriteRequest request) {
        log.debug("Updating favorite {} for user {}", favoriteId, userId);

        UserFavorite favorite = userFavoriteRepository.findByIdAndUserId(favoriteId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite not found or does not belong to you"));

        if (request.getNote() != null) {
            favorite.setNote(request.getNote());
        }

        UserFavorite savedFavorite = userFavoriteRepository.save(favorite);
        return userFavoriteMapper.toResponse(savedFavorite);
    }

    /**
     * Get user's favorites
     */
    @Transactional(readOnly = true)
    public PageResponse<FavoriteResponse> getUserFavorites(UUID userId, int page, int limit) {
        // Verify user exists
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }

        int pageSize = PaginationUtils.validateAndGetPageSize(limit);
        Pageable pageable = PageRequest.of(Math.max(0, page), pageSize);

        Page<UserFavorite> pagination = userFavoriteRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

        return PageResponse.of(
                pagination.getContent().stream()
                        .map(userFavoriteMapper::toResponse)
                        .toList(),
                page,
                limit,
                pagination.getTotalElements());
    }
}
