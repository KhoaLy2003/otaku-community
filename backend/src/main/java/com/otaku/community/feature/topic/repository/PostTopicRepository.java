package com.otaku.community.feature.topic.repository;

import com.otaku.community.feature.topic.entity.PostTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PostTopicRepository extends JpaRepository<PostTopic, UUID> {

//    @Query("SELECT pt FROM PostTopic pt WHERE pt.postId = :postId")
//    List<PostTopic> findByPostId(@Param("postId") UUID postId);
//
//    @Query("SELECT pt FROM PostTopic pt WHERE pt.topicId = :topicId")
//    List<PostTopic> findByTopicId(@Param("topicId") UUID topicId);

    @Query("SELECT pt.topic.id FROM PostTopic pt WHERE pt.post.id = :postId")
    List<UUID> findTopicIdsByPostId(@Param("postId") UUID postId);

//    @Query("SELECT pt.postId FROM PostTopic pt WHERE pt.topicId = :topicId")
//    List<UUID> findPostIdsByTopicId(@Param("topicId") UUID topicId);

//    @Query("SELECT CASE WHEN COUNT(pt) > 0 THEN true ELSE false END FROM PostTopic pt WHERE pt.postId = :postId AND pt.topicId = :topicId")
//    boolean existsByPostIdAndTopicId(@Param("postId") UUID postId, @Param("topicId") UUID topicId);

    @Modifying
    @Query("DELETE FROM PostTopic pt WHERE pt.post.id = :postId")
    void deleteByPostId(@Param("postId") UUID postId);

    @Modifying
    @Query("DELETE FROM PostTopic pt WHERE pt.post.id = :topicId")
    void deleteByTopicId(@Param("topicId") UUID topicId);

//    @Modifying
//    @Query("DELETE FROM PostTopic pt WHERE pt.postId = :postId AND pt.topicId = :topicId")
//    void deleteByPostIdAndTopicId(@Param("postId") UUID postId, @Param("topicId") UUID topicId);

    @Query("SELECT COUNT(pt) FROM PostTopic pt WHERE pt.post.id = :topicId")
    long countPostsByTopicId(@Param("topicId") UUID topicId);
}