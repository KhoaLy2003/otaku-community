package com.otaku.community.feature.news.service;

import com.otaku.community.feature.news.dto.RssItemDto;
import com.otaku.community.feature.news.entity.NewsSource;
import com.rometools.rome.feed.synd.SyndCategory;
import com.rometools.rome.feed.synd.SyndEnclosure;
import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import lombok.extern.slf4j.Slf4j;
import org.jdom2.Element;
import org.jsoup.Jsoup;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.time.Instant;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Service
@Slf4j
public class RssFeedParser {

    public List<RssItemDto> parseRssFeed(String rssUrl, NewsSource source) {
        try {
            SyndFeedInput input = new SyndFeedInput();
            SyndFeed feed = input.build(new XmlReader(new URL(rssUrl)));

            return feed.getEntries().stream()
                    .map(entry -> mapToRssItemDto(entry, source))
                    .toList();

        } catch (Exception e) {
            log.error("Failed to parse RSS feed from {}: {}", rssUrl, e.getMessage());
            return Collections.emptyList();
        }
    }

    private RssItemDto mapToRssItemDto(SyndEntry entry, NewsSource source) {
        return RssItemDto.builder()
                .title(entry.getTitle())
                .summary(extractSummary(entry))
                .content(extractContent(entry))
                .link(entry.getLink())
                .imageUrl(extractImageUrl(entry))
                .author(extractAuthor(entry))
                .publishedAt(convertToInstant(entry.getPublishedDate()))
                .source(source)
                .categories(extractCategories(entry))
                .build();
    }

    private String extractSummary(SyndEntry entry) {
        if (entry.getDescription() != null) {
            return cleanHtml(entry.getDescription().getValue());
        }
        return null;
    }

    private String extractContent(SyndEntry entry) {
        if (entry.getContents() != null && !entry.getContents().isEmpty()) {
            return cleanHtml(entry.getContents().get(0).getValue());
        }
        return extractSummary(entry);
    }

    private String extractImageUrl(SyndEntry entry) {
        // Handle media:thumbnail for Crunchyroll
        if (entry.getForeignMarkup() != null) {
            for (Element element : entry.getForeignMarkup()) {
                if ("thumbnail".equals(element.getName()) &&
                        "http://search.yahoo.com/mrss/".equals(element.getNamespaceURI())) {
                    return element.getAttributeValue("url");
                }
            }
        }

        // Handle enclosures
        if (entry.getEnclosures() != null && !entry.getEnclosures().isEmpty()) {
            SyndEnclosure enclosure = entry.getEnclosures().get(0);
            if (enclosure.getType() != null && enclosure.getType().startsWith("image/")) {
                return enclosure.getUrl();
            }
        }

        return null;
    }

    private String extractAuthor(SyndEntry entry) {
        if (entry.getAuthor() != null && !entry.getAuthor().isEmpty()) {
            return entry.getAuthor();
        }
        if (entry.getAuthors() != null && !entry.getAuthors().isEmpty()) {
            return entry.getAuthors().get(0).getName();
        }
        return null;
    }

    private List<String> extractCategories(SyndEntry entry) {
        if (entry.getCategories() != null) {
            return entry.getCategories().stream()
                    .map(SyndCategory::getName)
                    .toList();
        }
        return Collections.emptyList();
    }

    private Instant convertToInstant(Date date) {
        return date != null ? date.toInstant() : Instant.now();
    }

    private String cleanHtml(String html) {
        if (html == null)
            return null;
        return Jsoup.parse(html).text();
    }
}
