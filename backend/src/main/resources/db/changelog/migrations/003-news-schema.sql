--liquibase formatted sql

--changeset khoa:1770125722705
-- Create news table
CREATE TABLE news (
    id UUID PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    content TEXT,
    link VARCHAR(1000) NOT NULL,
    image_url VARCHAR(1000),
    author VARCHAR(255),
    source VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    published_at TIMESTAMP NOT NULL,
    fetched_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP,
    CONSTRAINT uk_news_link UNIQUE (link)
);

-- Create rss_sources table
CREATE TABLE rss_sources (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    priority INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMP,
    last_sync_status VARCHAR(100),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP,
    CONSTRAINT uk_rss_sources_name UNIQUE (name),
    CONSTRAINT uk_rss_sources_url UNIQUE (url)
);

-- Indexes for news table
CREATE INDEX idx_news_published_at ON news (published_at DESC);
CREATE INDEX idx_news_source ON news (source);
CREATE INDEX idx_news_category ON news (category);
CREATE INDEX idx_news_created_at ON news (created_at DESC);

-- Seed initial RSS sources
INSERT INTO rss_sources (id, name, url, priority, enabled, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'CRUNCHYROLL', 'https://cr-news-api-service.prd.crunchyrollsvc.com/v1/en-US/rss', 10, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'ANIME_NEWS_NETWORK', 'https://www.animenewsnetwork.com/all/rss.xml', 5, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
