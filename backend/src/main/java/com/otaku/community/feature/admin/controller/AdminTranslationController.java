package com.otaku.community.feature.admin.controller;

import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.feature.admin.service.AdminService;
import com.otaku.community.feature.manga.entity.Translation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/translations")
@RequiredArgsConstructor
public class AdminTranslationController {

    private final AdminService adminService;

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> updateStatus(@PathVariable UUID id,
                                                          @RequestParam Translation.TranslationStatus status) {
        adminService.updateTranslationStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Translation status updated successfully", null));
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<ApiResponse<Void>> verifyTranslation(@PathVariable UUID id, @RequestParam boolean verified) {
        adminService.verifyTranslation(id, verified);
        String message = verified ? "Translation verified successfully" : "Translation verification removed";
        return ResponseEntity.ok(ApiResponse.success(message, null));
    }
}
