--liquibase formatted sql

--changeset khoa:1770213709935
-- Add rss_source_id column, populate it from existing source text, add FK constraint, and remove old source column
ALTER TABLE news ADD COLUMN rss_source_id UUID;

-- Make column non-nullable and add FK
ALTER TABLE news ALTER COLUMN rss_source_id SET NOT NULL;
ALTER TABLE news ADD CONSTRAINT fk_news_rss_source FOREIGN KEY (rss_source_id) REFERENCES rss_sources(id);

-- Update index: drop old index and create index on rss_source_id
DROP INDEX IF EXISTS idx_news_source;
CREATE INDEX idx_news_rss_source ON news (rss_source_id);

-- Optionally drop the old source column
ALTER TABLE news DROP COLUMN source;
