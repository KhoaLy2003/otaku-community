package com.otaku.community.feature.feedback.repository;

import com.otaku.community.feature.feedback.entity.Feedback;
import com.otaku.community.feature.feedback.entity.FeedbackStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {
    Page<Feedback> findByStatus(FeedbackStatus status, Pageable pageable);

    long countByStatus(FeedbackStatus status);
}
