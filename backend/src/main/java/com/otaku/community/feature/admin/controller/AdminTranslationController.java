package com.otaku.community.feature.admin.controller;

import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.feature.admin.service.AdminService;
import com.otaku.community.feature.manga.entity.Translation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/translations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminTranslationController {

    private final AdminService adminService;

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> updateStatus(@PathVariable UUID id,
                                                          @RequestParam Translation.TranslationStatus status) {
        adminService.updateTranslationStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Translation status updated successfully", null));
    }
}
