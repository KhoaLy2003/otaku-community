package com.otaku.community.feature.post.service;

import com.otaku.community.feature.post.dto.CreatePostRequest;
import com.otaku.community.feature.post.dto.PostDetailResponse;
import com.otaku.community.feature.post.dto.PostResponse;
import com.otaku.community.feature.post.dto.UpdatePostRequest;

import java.util.UUID;

public interface PostService {
    PostResponse createPost(CreatePostRequest request);

    PostResponse updatePost(UUID postId, UpdatePostRequest request);

    void deletePost(UUID postId);

    PostDetailResponse getPostDetail(UUID postId);
}
