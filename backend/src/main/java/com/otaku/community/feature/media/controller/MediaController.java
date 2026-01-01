package com.otaku.community.feature.media.controller;

import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.feature.media.dto.MediaUploadResponse;
import com.otaku.community.feature.media.service.MediaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Media", description = "Media upload and management endpoints")
public class MediaController {

    private final MediaService mediaService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
            summary = "Upload media file",
            description = "Upload an image or video file to Cloudinary. Supports JPEG, PNG, GIF, WebP, and MP4 formats with a maximum size of 5MB."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Media uploaded successfully",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid file format or size",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "413",
                    description = "File size too large",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "415",
                    description = "Unsupported media type",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "500",
                    description = "Internal server error during upload",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    //@PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Object>> uploadMedia(
            @Parameter(
                    description = "Media file to upload (JPEG, PNG, GIF, WebP, MP4 - max 5MB)",
                    required = true,
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)
            )
            @RequestParam("file") MultipartFile file
    ) {
        log.debug("Received media upload request for file: {}", file.getOriginalFilename());

        MediaUploadResponse response = mediaService.uploadMedia(file);

        log.debug("Media upload completed successfully. URL: {}", response.getUrl());

        return ResponseEntity.ok(ApiResponse.success("Media uploaded successfully", response));
    }

    @DeleteMapping("/{publicId}")
    @Operation(
            summary = "Delete media file",
            description = "Delete a media file from Cloudinary using its public ID"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Media deleted successfully",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "Insufficient permissions",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    @SecurityRequirement(name = "bearerAuth")
    //@PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<String>> deleteMedia(
            @Parameter(description = "Public ID of the media to delete", required = true)
            @PathVariable String publicId
    ) {
        log.debug("Received media deletion request for public ID: {}", publicId);

        mediaService.deleteMedia(publicId);

        log.debug("Media deletion completed for public ID: {}", publicId);

        return ResponseEntity.ok(ApiResponse.success(null, "Media deleted successfully"));
    }
}