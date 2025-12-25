package com.otaku.community.feature.post.service;

import com.otaku.community.feature.post.dto.PostMediaResponse;
import com.otaku.community.feature.post.dto.UserMediaResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface PostMedialService {
    List<PostMediaResponse> uploadPostMedia(UUID postId, List<MultipartFile> files);

    UserMediaResponse getUserMedia(UUID userId, String cursor, Integer limit);
}
