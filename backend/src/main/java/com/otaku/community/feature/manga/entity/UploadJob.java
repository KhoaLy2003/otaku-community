package com.otaku.community.feature.manga.entity;

import com.otaku.community.common.entity.BaseEntity;
import com.otaku.community.feature.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "upload_jobs", uniqueConstraints = {
        @UniqueConstraint(name = "uk_upload_jobs_translation", columnNames = "translation_id")
}, indexes = {
        @Index(name = "idx_upload_user_id", columnList = "user_id"),
        @Index(name = "idx_upload_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UploadJob extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "translation_id", nullable = false, foreignKey = @ForeignKey(name = "fk_upload_jobs_translation"))
    private Translation translation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_upload_jobs_user"))
    private User user;

    @Column(name = "total_pages", nullable = false)
    private Integer totalPages;

    @Column(name = "uploaded_pages", nullable = false)
    @Builder.Default
    private Integer uploadedPages = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private UploadJobStatus status = UploadJobStatus.PENDING;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    public enum UploadJobStatus {
        PENDING, UPLOADING, COMPLETED, FAILED, CANCELLED
    }
}
