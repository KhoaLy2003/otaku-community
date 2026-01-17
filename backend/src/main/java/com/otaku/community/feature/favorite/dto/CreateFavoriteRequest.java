package com.otaku.community.feature.favorite.dto;

import com.otaku.community.feature.post.entity.PostReferenceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateFavoriteRequest {

    @NotNull(message = "Reference type is required")
    private PostReferenceType type;

    @NotNull(message = "External ID is required")
    private Long externalId;

    @NotBlank(message = "Title is required")
    @Size(max = 512, message = "Title cannot exceed 512 characters")
    private String title;

    private String imageUrl;

    @Size(max = 500, message = "Note cannot exceed 500 characters")
    private String note;
}
