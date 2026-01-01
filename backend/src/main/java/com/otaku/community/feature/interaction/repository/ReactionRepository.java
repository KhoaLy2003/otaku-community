package com.otaku.community.feature.interaction.repository;

import com.otaku.community.feature.interaction.entity.Reaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, UUID> {

    /**
     * Find a reaction by user, target type, and target ID
     */
    Optional<Reaction> findByUserIdAndTargetTypeAndTargetId(
            UUID userId,
            Reaction.TargetType targetType,
            UUID targetId);

    /**
     * Check if a user has reacted to a specific target
     */
    boolean existsByUserIdAndTargetTypeAndTargetId(
            UUID userId,
            Reaction.TargetType targetType,
            UUID targetId);

    /**
     * Count reactions by target and reaction type
     */
    long countByTargetTypeAndTargetIdAndReactionType(
            Reaction.TargetType targetType,
            UUID targetId,
            Reaction.ReactionType reactionType);

    /**
     * Delete a reaction by user, target type, and target ID
     */
    void deleteByUserIdAndTargetTypeAndTargetId(
            UUID userId,
            Reaction.TargetType targetType,
            UUID targetId);

    /**
     * Get all reactions by a user for a specific target type
     */
    List<Reaction> findByUserIdAndTargetType(UUID userId, Reaction.TargetType targetType);

    /**
     * Get all target IDs that a user has liked (for posts)
     */
    @Query("SELECT r.targetId FROM Reaction r WHERE r.userId = :userId " +
            "AND r.targetType = :targetType AND r.reactionType = :reactionType")
    List<UUID> findTargetIdsByUserIdAndTargetTypeAndReactionType(
            @Param("userId") UUID userId,
            @Param("targetType") Reaction.TargetType targetType,
            @Param("reactionType") Reaction.ReactionType reactionType);

    /**
     * Get all target IDs from a list that a user has liked
     */
    @Query("SELECT r.targetId FROM Reaction r WHERE r.userId = :userId " +
            "AND r.targetType = :targetType AND r.reactionType = :reactionType " +
            "AND r.targetId IN :targetIds")
    Set<UUID> findLikedTargetIds(
            @Param("userId") UUID userId,
            @Param("targetType") Reaction.TargetType targetType,
            @Param("reactionType") Reaction.ReactionType reactionType,
            @Param("targetIds") Collection<UUID> targetIds);

    /**
     * Get all reactions for a specific target
     */
    List<Reaction> findByTargetTypeAndTargetId(Reaction.TargetType targetType, UUID targetId);

    /**
     * Get paginated reactions for a specific target and reaction type
     */
    Page<Reaction> findByTargetTypeAndTargetIdAndReactionTypeOrderByCreatedAtDesc(
            Reaction.TargetType targetType,
            UUID targetId,
            Reaction.ReactionType reactionType,
            Pageable pageable);
}