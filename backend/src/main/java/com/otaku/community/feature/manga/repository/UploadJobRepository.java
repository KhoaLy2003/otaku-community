package com.otaku.community.feature.manga.repository;

import com.otaku.community.feature.manga.entity.UploadJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UploadJobRepository extends JpaRepository<UploadJob, UUID> {

    @Query("SELECT u FROM UploadJob u WHERE u.id = :id AND u.deletedAt IS NULL")
    Optional<UploadJob> findByIdAndNotDeleted(@Param("id") UUID id);

    @Query("SELECT u FROM UploadJob u JOIN FETCH u.user JOIN FETCH u.translation WHERE u.id = :id")
    Optional<UploadJob> findByIdWithDetails(@Param("id") UUID id);

    @Query("SELECT u FROM UploadJob u WHERE u.translation.id IN :translationIds AND u.deletedAt IS NULL")
    List<UploadJob> findByTranslationIdInAndNotDeleted(@Param("translationIds") List<UUID> translationIds);

    @Modifying
    @Transactional
    @Query("UPDATE UploadJob u SET u.uploadedPages = u.uploadedPages + :count WHERE u.id = :jobId")
    int addToUploadedPages(@Param("jobId") UUID jobId, @Param("count") int count);

    @Modifying
    @Transactional
    @Query("UPDATE UploadJob u SET u.status = :status WHERE u.id = :jobId")
    void updateStatus(@Param("jobId") UUID jobId, @Param("status") UploadJob.UploadJobStatus status);

    @Modifying
    @Transactional
    @Query("UPDATE UploadJob u SET u.status = :status, u.errorMessage = :errorMessage WHERE u.id = :jobId")
    void markAsFailed(@Param("jobId") UUID jobId, @Param("status") UploadJob.UploadJobStatus status,
                      @Param("errorMessage") String errorMessage);

    @Modifying
    @Transactional
    @Query("DELETE FROM UploadJob u WHERE u.translation.id = :translationId")
    void deleteByTranslationId(@Param("translationId") UUID translationId);
}
