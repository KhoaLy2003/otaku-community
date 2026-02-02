package com.otaku.community.feature.admin.controller;

import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.admin.dto.AdminUserDetailDto;
import com.otaku.community.feature.admin.dto.AdminUserListItemDto;
import com.otaku.community.feature.admin.service.AdminService;
import com.otaku.community.feature.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AdminUserListItemDto>>> getUsers(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) User.UserRole role,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getUsers(query, role, status, pageable)));
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<ApiResponse<Void>> updateRole(@PathVariable UUID id, @RequestParam User.UserRole role) {
        adminService.updateRole(id, role);
        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", null));
    }

    @PostMapping("/{id}/ban")
    public ResponseEntity<ApiResponse<Void>> banUser(@PathVariable UUID id,
                                                     @RequestParam(required = false) String reason) {
        adminService.banUser(id, reason);
        return ResponseEntity.ok(ApiResponse.success("User banned successfully", null));
    }

    @PostMapping("/{id}/unban")
    public ResponseEntity<ApiResponse<Void>> unbanUser(@PathVariable UUID id) {
        adminService.unbanUser(id);
        return ResponseEntity.ok(ApiResponse.success("User unbanned successfully", null));
    }

    @PostMapping("/{id}/lock")
    public ResponseEntity<ApiResponse<Void>> lockUser(@PathVariable UUID id, @RequestParam boolean lock) {
        adminService.lockUser(id, lock);
        String message = lock ? "User locked successfully" : "User unlocked successfully";
        return ResponseEntity.ok(ApiResponse.success(message, null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminUserDetailDto>> getUserDetail(
            @PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getUserDetail(id)));
    }
}
