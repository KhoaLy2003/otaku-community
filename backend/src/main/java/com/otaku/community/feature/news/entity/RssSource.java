package com.otaku.community.feature.news.entity;

import com.otaku.community.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "rss_sources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RssSource extends BaseEntity {

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "url", nullable = false, unique = true, length = 500)
    private String url;

    @Column(name = "priority")
    private Integer priority = 0;

    @Column(name = "enabled")
    private boolean enabled = true;

    @Column(name = "last_sync_at")
    private Instant lastSyncAt;

    @Column(name = "last_sync_status", length = 100)
    private String lastSyncStatus;
}
