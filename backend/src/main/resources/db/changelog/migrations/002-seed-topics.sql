--liquibase formatted sql

--changeset khoa:002-seed-topics
INSERT INTO public.topics (
    id,
    name,
    slug,
    description,
    color,
    is_default,
    created_at,
    updated_at
)
VALUES
(gen_random_uuid(), 'Anime', 'anime', 'All about anime series, movies, and discussions', '#FF6B6B', true, now(), now()),
(gen_random_uuid(), 'Manga', 'manga', 'Manga reviews, recommendations, and news', '#4D96FF', true, now(), now()),
(gen_random_uuid(), 'Japan Travel', 'japan-travel', 'Travel tips, places, and experiences in Japan', '#6BCB77', true, now(), now()),
(gen_random_uuid(), 'JLPT', 'jlpt', 'Japanese Language Proficiency Test learning and tips', '#FFD93D', true, now(), now()),
(gen_random_uuid(), 'Food', 'food', 'Japanese food, recipes, and restaurant reviews', '#FF9F45', true, now(), now()),
(gen_random_uuid(), 'Culture', 'culture', 'Japanese culture, traditions, and lifestyle', '#845EC2', true, now(), now());
