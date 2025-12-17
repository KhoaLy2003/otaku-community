package com.otaku.community.feature.topic.repository;

import com.otaku.community.feature.topic.entity.Topic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TopicRepository extends JpaRepository<Topic, UUID> {

    Optional<Topic> findByName(String name);

    Optional<Topic> findBySlug(String slug);

    @Query("SELECT t FROM Topic t WHERE t.deletedAt IS NULL AND t.id = :id")
    Optional<Topic> findByIdAndNotDeleted(@Param("id") UUID id);

    @Query("SELECT t FROM Topic t WHERE t.deletedAt IS NULL AND t.name = :name")
    Optional<Topic> findByNameAndNotDeleted(@Param("name") String name);

    @Query("SELECT t FROM Topic t WHERE t.deletedAt IS NULL AND t.slug = :slug")
    Optional<Topic> findBySlugAndNotDeleted(@Param("slug") String slug);

    @Query("SELECT t FROM Topic t WHERE t.deletedAt IS NULL ORDER BY t.name ASC")
    List<Topic> findAllActiveTopics();

    @Query("SELECT t FROM Topic t WHERE t.deletedAt IS NULL AND t.isDefault = true ORDER BY t.name ASC")
    List<Topic> findDefaultTopics();

    @Query("SELECT t FROM Topic t WHERE t.deletedAt IS NULL AND LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY t.name ASC")
    Page<Topic> searchByName(@Param("query") String query, Pageable pageable);

    @Query("SELECT t FROM Topic t WHERE t.deletedAt IS NULL AND t.id IN :topicIds")
    List<Topic> findByIdsAndNotDeleted(@Param("topicIds") List<UUID> topicIds);

    boolean existsByName(String name);

    boolean existsBySlug(String slug);

    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM Topic t WHERE t.deletedAt IS NULL AND t.name = :name")
    boolean existsByNameAndNotDeleted(@Param("name") String name);

    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM Topic t WHERE t.deletedAt IS NULL AND t.slug = :slug")
    boolean existsBySlugAndNotDeleted(@Param("slug") String slug);

    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM Topic t WHERE t.deletedAt IS NULL AND t.name = :name AND t.id != :excludeId")
    boolean existsByNameAndNotDeletedExcludingId(@Param("name") String name, @Param("excludeId") UUID excludeId);

    @Query("SELECT COUNT(t) FROM Topic t WHERE t.deletedAt IS NULL")
    long countActiveTopics();
}