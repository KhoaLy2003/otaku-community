package com.otaku.community.feature.manga.mapper;

import com.otaku.community.feature.manga.dto.chapter.ChapterResponse;
import com.otaku.community.feature.manga.dto.translation.TranslationDetailResponse;
import com.otaku.community.feature.manga.dto.translation.TranslationPageResponse;
import com.otaku.community.feature.manga.dto.translation.TranslationResponse;
import com.otaku.community.feature.manga.dto.translation.UploadJobResponse;
import com.otaku.community.feature.manga.entity.Chapter;
import com.otaku.community.feature.manga.entity.Translation;
import com.otaku.community.feature.manga.entity.TranslationPage;
import com.otaku.community.feature.manga.entity.UploadJob;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MangaReaderMapper {

    ChapterResponse toChapterResponse(Chapter chapter);

    @Mapping(target = "translationId", source = "id")
    @Mapping(target = "translator", source = "translator.username")
    @Mapping(target = "translatorAvatar", source = "translator.avatarUrl")
    @Mapping(target = "chapterId", source = "chapter.id")
    @Mapping(target = "chapterNumber", source = "chapter.chapterNumber")
    @Mapping(target = "mangaId", source = "chapter.manga.malId")
    @Mapping(target = "mangaTitle", source = "chapter.manga.title")
    @Mapping(target = "mangaUrl", source = "chapter.manga.coverImage")
    TranslationResponse toTranslationResponse(Translation translation);

    @Mapping(target = "translationId", source = "id")
    @Mapping(target = "translator", source = "translator.username")
    @Mapping(target = "translatorAvatar", source = "translator.avatarUrl")
    @Mapping(target = "chapterId", source = "chapter.id")
    @Mapping(target = "chapterNumber", source = "chapter.chapterNumber")
    @Mapping(target = "chapterTitle", source = "chapter.title")
    @Mapping(target = "mangaId", source = "chapter.manga.malId")
    @Mapping(target = "mangaTitle", source = "chapter.manga.title")
    @Mapping(target = "pages", ignore = true)
    TranslationDetailResponse toTranslationDetailResponse(Translation translation);

    @Mapping(target = "id", source = "id")
    TranslationPageResponse toPageResponse(TranslationPage page);

    @Mapping(target = "uploadJobId", source = "id")
    @Mapping(target = "translationId", source = "translation.id")
    @Mapping(target = "progress", expression = "java(calculateProgress(job))")
    UploadJobResponse toUploadJobResponse(UploadJob job);

    default Integer calculateProgress(UploadJob job) {
        if (job.getTotalPages() == null || job.getTotalPages() == 0) {
            return 0;
        }
        return (int) ((job.getUploadedPages() * 100.0) / job.getTotalPages());
    }
}
