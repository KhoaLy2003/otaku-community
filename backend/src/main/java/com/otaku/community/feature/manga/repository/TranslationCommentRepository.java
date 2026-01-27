package com.otaku.community.feature.manga.repository;

import com.otaku.community.feature.manga.entity.TranslationComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TranslationCommentRepository extends JpaRepository<TranslationComment, UUID> {
    Page<TranslationComment> findByTranslationIdAndParentIsNullAndDeletedAtIsNullOrderByCreatedAtDesc(UUID translationId,
                                                                                                      Pageable pageable);

    long countByTranslationIdAndDeletedAtIsNull(UUID translationId);
}
