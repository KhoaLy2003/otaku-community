--liquibase formatted sql

--changeset khoa:seed-data
INSERT INTO public.topics (id, name, slug, description, color, is_default, created_at, updated_at)
VALUES (gen_random_uuid(), 'Anime', 'anime', 'All about anime series, movies, and discussions', '#FF6B6B', true, now(),
        now()),
       (gen_random_uuid(), 'Manga', 'manga', 'Manga reviews, recommendations, and news', '#4D96FF', true, now(), now()),
       (gen_random_uuid(), 'Japan Travel', 'japan-travel', 'Travel tips, places, and experiences in Japan', '#6BCB77',
        true, now(), now()),
       (gen_random_uuid(), 'JLPT', 'jlpt', 'Japanese Language Proficiency Test learning and tips', '#FFD93D', true,
        now(), now()),
       (gen_random_uuid(), 'Food', 'food', 'Japanese food, recipes, and restaurant reviews', '#FF9F45', true, now(),
        now()),
       (gen_random_uuid(), 'Culture', 'culture', 'Japanese culture, traditions, and lifestyle', '#845EC2', true, now(),
        now());

-- Seed initial RSS sources
INSERT INTO public.rss_sources (id, name, url, priority, enabled, created_at, updated_at)
VALUES (gen_random_uuid(), 'CRUNCHYROLL', 'https://cr-news-api-service.prd.crunchyrollsvc.com/v1/en-US/rss', 10, TRUE,
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       (gen_random_uuid(), 'ANIME_NEWS_NETWORK', 'https://www.animenewsnetwork.com/all/rss.xml', 5, TRUE,
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Seed admin account
INSERT INTO public.users
(id, created_at, deleted_at, updated_at, auth0_id, avatar_url, bio, cover_image_url, email, group_name, interests,
 "location", profile_visibility, "role", total_manga_upvotes, total_manga_views, total_translations, username,
 is_locked)
VALUES ('76e45cee-9171-4ace-a50a-418e8581d5cc'::uuid, '2026-02-03 20:42:04.531', NULL, '2026-02-03 20:42:04.531',
        'auth0|697dd8d539d5dc68c549a4b6',
        'https://res.cloudinary.com/dfdwupiah/image/upload/v1767623060/otaku-community/avatar_qmmxgm.png', NULL, NULL,
        'otaku-admin@yopmail.com', NULL, NULL, NULL, 'PUBLIC', 'ADMIN', 0, 0, 0, 'otaku-admin', false);
