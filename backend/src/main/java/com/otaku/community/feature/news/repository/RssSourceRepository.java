package com.otaku.community.feature.news.repository;

import com.otaku.community.feature.news.entity.RssSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RssSourceRepository extends JpaRepository<RssSource, UUID> {
    List<RssSource> findByEnabledTrueOrderByPriorityAsc();
}
