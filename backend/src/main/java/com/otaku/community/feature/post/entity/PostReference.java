package com.otaku.community.feature.post.entity;

import com.otaku.community.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "post_references", indexes = {
        @Index(name = "idx_post_ref_post_id", columnList = "post_id"),
        @Index(name = "idx_post_ref_external_id", columnList = "external_id"),
        @Index(name = "idx_post_ref_type_ext_id", columnList = "reference_type, external_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostReference extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Enumerated(EnumType.STRING)
    @Column(name = "reference_type", nullable = false, length = 20)
    private PostReferenceType referenceType;

    @Column(name = "external_id", nullable = false)
    private Long externalId;

    @Column(name = "title", length = 512)
    private String title;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "is_auto_linked", nullable = false)
    private boolean isAutoLinked = false;
}
