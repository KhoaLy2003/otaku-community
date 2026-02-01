package com.otaku.community.feature.admin.controller;

import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.feature.admin.dto.SystemSettingsDto;
import com.otaku.community.feature.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/system")
@RequiredArgsConstructor
public class AdminSystemController {

    private final AdminService adminService;

    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<SystemSettingsDto>> getSettings() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getSystemSettings()));
    }

    @PutMapping("/settings")
    public ResponseEntity<ApiResponse<Void>> updateSettings(@RequestBody SystemSettingsDto settings) {
        adminService.updateSystemSettings(settings);
        return ResponseEntity.ok(ApiResponse.success("System settings updated successfully", null));
    }
}
