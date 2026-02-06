package com.otaku.community.feature.activity.repository;

import com.otaku.community.feature.activity.entity.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, UUID> {
    Page<ActivityLog> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    long countByActionTypeIn(
            java.util.Collection<com.otaku.community.feature.activity.entity.ActivityType> actionTypes);
}
