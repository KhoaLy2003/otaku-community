package com.otaku.community.feature.manga.event;

import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Getter
public class MangaUploadEvent {
    private final UUID jobId;
    private final List<byte[]> fileDatas;
    private final List<String> filenames;
    private final Integer startPageIndex;

    public MangaUploadEvent(UUID jobId, List<byte[]> fileDatas, List<String> filenames, Integer startPageIndex) {
        this.jobId = jobId;
        this.fileDatas = fileDatas;
        this.filenames = filenames;
        this.startPageIndex = startPageIndex;
    }
}
