package com.otaku.community.feature.feedback.mapper;

import com.otaku.community.feature.feedback.dto.FeedbackRequestDto;
import com.otaku.community.feature.feedback.dto.FeedbackResponseDto;
import com.otaku.community.feature.feedback.entity.Feedback;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FeedbackMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "moderator", ignore = true)
    @Mapping(target = "moderatorNotes", ignore = true)
    @Mapping(target = "reporter", ignore = true)
    Feedback toEntity(FeedbackRequestDto dto);

    @Mapping(target = "moderatorId", source = "moderator.id")
    @Mapping(target = "moderatorName", source = "moderator.username")
    @Mapping(target = "reporterId", source = "reporter.id")
    @Mapping(target = "reporterName", expression = "java(feedback.isAnonymous() ? \"Anonymous\" : (feedback.getReporter() != null ? feedback.getReporter().getUsername() : feedback.getReporterName()))")
    @Mapping(target = "reporterEmail", expression = "java(feedback.isAnonymous() ? null : (feedback.getReporter() != null ? feedback.getReporter().getEmail() : feedback.getReporterEmail()))")
    FeedbackResponseDto toDto(Feedback feedback);
}
