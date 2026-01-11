package com.otaku.community.feature.post.service;

import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.post.dto.CreatePostRequest;
import com.otaku.community.feature.post.dto.PostDetailResponse;
import com.otaku.community.feature.post.dto.PostResponse;
import com.otaku.community.feature.post.dto.UpdatePostRequest;
import com.otaku.community.feature.post.dto.UserPostResponse;
import com.otaku.community.feature.post.entity.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface PostService {
    PostResponse createPost(CreatePostRequest request);

    PostResponse updatePost(UUID postId, UpdatePostRequest request);

    void deletePost(UUID postId);

    PostDetailResponse getPostDetail(UUID postId);

    Page<PostResponse> getPostsByUser(UUID userId, Pageable pageable);

    Page<PostResponse> getPostsByUserAndStatus(UUID userId, PostStatus status, Pageable pageable);

    UserPostResponse getPostsByUserName(String userName, PostStatus status, String cursor, Integer limit);

    PostResponse publishPost(UUID postId);

    PostResponse makeDraft(UUID postId);

    boolean isPostOwner(UUID postId);

    PageResponse<PostResponse> getPostsByReference(String type, Long externalId, int page, int limit);
}
