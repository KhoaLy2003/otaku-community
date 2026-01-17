package com.otaku.community.feature.favorite.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateFavoriteRequest {

    @Size(max = 500, message = "Note cannot exceed 500 characters")
    private String note;
}
