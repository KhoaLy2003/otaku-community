package com.otaku.community.feature.topic.entity;

import com.otaku.community.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "topics", indexes = {
        @Index(name = "idx_topics_name", columnList = "name"),
        @Index(name = "idx_topics_slug", columnList = "slug"),
        @Index(name = "idx_topics_deleted_at", columnList = "deleted_at"),
        @Index(name = "idx_topics_is_default", columnList = "is_default")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_topics_name", columnNames = "name"),
        @UniqueConstraint(name = "uk_topics_slug", columnNames = "slug")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Topic extends BaseEntity {

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "slug", nullable = false, unique = true, length = 100)
    private String slug;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "color", length = 7)
    private String color;

    @Column(name = "is_default", nullable = false)
    @Builder.Default
    private Boolean isDefault = false;

    /**
     * Generates a URL-friendly slug from the topic name
     */
    public static String generateSlug(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Topic name cannot be null or empty");
        }
        
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }

    /**
     * Sets the name and automatically generates the slug
     */
    public void setNameAndGenerateSlug(String name) {
        this.name = name;
        this.slug = generateSlug(name);
    }

    /**
     * Validates the color format (hex color)
     */
    public boolean isValidColor() {
        if (color == null) {
            return true; // Color is optional
        }
        return color.matches("^#[0-9A-Fa-f]{6}$");
    }
}