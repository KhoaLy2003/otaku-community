package com.otaku.community.feature.manga.repository;

import com.otaku.community.feature.manga.entity.Manga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MangaRepository extends JpaRepository<Manga, UUID> {
    Optional<Manga> findByMalId(Integer malId);
}
