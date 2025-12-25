-- public.topics definition

-- Drop table

-- DROP TABLE public.topics;

CREATE TABLE public.topics (
id uuid NOT NULL,
created_at timestamptz(6) NOT NULL,
deleted_at timestamptz(6) NULL,
updated_at timestamptz(6) NOT NULL,
color varchar(7) NULL,
description text NULL,
is_default bool NOT NULL,
"name" varchar(100) NOT NULL,
slug varchar(100) NOT NULL,
CONSTRAINT topics_pkey PRIMARY KEY (id),
CONSTRAINT uk_topics_name UNIQUE (name),
CONSTRAINT uk_topics_slug UNIQUE (slug)
);
CREATE INDEX idx_topics_deleted_at ON public.topics USING btree (deleted_at);
CREATE INDEX idx_topics_is_default ON public.topics USING btree (is_default);
CREATE INDEX idx_topics_name ON public.topics USING btree (name);
CREATE INDEX idx_topics_slug ON public.topics USING btree (slug);

-- public.user_feeds definition

-- Drop table

-- DROP TABLE public.user_feeds;

CREATE TABLE public.user_feeds (
id uuid NOT NULL,
created_at timestamp(6) NULL,
post_id uuid NOT NULL,
reason varchar(255) NULL,
score float8 NOT NULL,
user_id uuid NOT NULL,
author_id uuid NOT NULL,
CONSTRAINT user_feeds_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_user_feed_score ON public.user_feeds USING btree (score);
CREATE INDEX idx_user_feed_user_id ON public.user_feeds USING btree (user_id);

-- public.user_follows definition

-- Drop table

-- DROP TABLE public.user_follows;

CREATE TABLE public.user_follows (
id uuid NOT NULL,
created_at timestamp(6) NULL,
followed_id uuid NOT NULL,
follower_id uuid NOT NULL,
CONSTRAINT ukt21sqiubk1nu5epc9yieinc6h UNIQUE (follower_id, followed_id),
CONSTRAINT user_follows_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_user_follow_followed ON public.user_follows USING btree (followed_id);
CREATE INDEX idx_user_follow_follower ON public.user_follows USING btree (follower_id);

-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
id uuid NOT NULL,
created_at timestamptz(6) NOT NULL,
deleted_at timestamptz(6) NULL,
updated_at timestamptz(6) NOT NULL,
auth0_id varchar(255) NOT NULL,
avatar_url text NULL,
bio text NULL,
email varchar(255) NOT NULL,
interests \_text NULL,
"location" varchar(100) NULL,
"role" varchar(20) NOT NULL,
username varchar(50) NOT NULL,
CONSTRAINT uk_6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email),
CONSTRAINT uk_6muhtnbpqcydo2lsv78rginj8 UNIQUE (auth0_id),
CONSTRAINT uk_r43af9ap4edm43mmtq01oddj6 UNIQUE (username),
CONSTRAINT users_pkey PRIMARY KEY (id),
CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['USER'::character varying, 'ADMIN'::character varying])::text[])))
);
CREATE INDEX idx_users_deleted_at ON public.users USING btree (deleted_at);
CREATE INDEX idx_users_email ON public.users USING btree (email);
CREATE INDEX idx_users_username ON public.users USING btree (username);

-- public.posts definition

-- Drop table

-- DROP TABLE public.posts;

CREATE TABLE public.posts (
id uuid NOT NULL,
created_at timestamptz(6) NOT NULL,
deleted_at timestamptz(6) NULL,
updated_at timestamptz(6) NOT NULL,
"content" text NULL,
status varchar(20) NOT NULL,
title varchar(255) NOT NULL,
user_id uuid NOT NULL,
CONSTRAINT posts_pkey PRIMARY KEY (id),
CONSTRAINT posts_status_check CHECK (((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'PUBLISHED'::character varying])::text[]))),
CONSTRAINT fk5lidm6cqbc7u4xhqpxm898qme FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE INDEX idx_posts_created_at ON public.posts USING btree (created_at);
CREATE INDEX idx_posts_deleted_at ON public.posts USING btree (deleted_at);
CREATE INDEX idx_posts_status ON public.posts USING btree (status);
CREATE INDEX idx_posts_status_created_at ON public.posts USING btree (status, created_at);
CREATE INDEX idx_posts_user_id ON public.posts USING btree (user_id);

-- public.reactions definition

-- Drop table

-- DROP TABLE public.reactions;

CREATE TABLE public.reactions (
id uuid NOT NULL,
created_at timestamptz(6) NOT NULL,
deleted_at timestamptz(6) NULL,
updated_at timestamptz(6) NOT NULL,
reaction_type varchar(20) NOT NULL,
target_id uuid NOT NULL,
target_type varchar(20) NOT NULL,
user_id uuid NOT NULL,
CONSTRAINT reactions_pkey PRIMARY KEY (id),
CONSTRAINT reactions_reaction_type_check CHECK (((reaction_type)::text = ANY ((ARRAY['LIKE'::character varying, 'UNLIKE'::character varying])::text[]))),
CONSTRAINT reactions_target_type_check CHECK (((target_type)::text = ANY ((ARRAY['POST'::character varying, 'COMMENT'::character varying])::text[]))),
CONSTRAINT uk_reactions_user_target UNIQUE (user_id, target_type, target_id),
CONSTRAINT fkqmewaibcp5bxtlqxc2cawhuln FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE INDEX idx_reactions_target ON public.reactions USING btree (target_type, target_id);
CREATE INDEX idx_reactions_type ON public.reactions USING btree (reaction_type);
CREATE INDEX idx_reactions_user_id ON public.reactions USING btree (user_id);

-- public.user_feed definition

-- Drop table

-- DROP TABLE public.user_feed;

CREATE TABLE public.user_feed (
post_id uuid NOT NULL,
user_id uuid NOT NULL,
created_at timestamp(6) NOT NULL,
reason varchar(20) NOT NULL,
score float4 NOT NULL,
CONSTRAINT user_feed_pkey PRIMARY KEY (post_id, user_id),
CONSTRAINT user_feed_reason_check CHECK (((reason)::text = ANY ((ARRAY['FRIEND'::character varying, 'FOLLOW'::character varying, 'GROUP'::character varying, 'PAGE'::character varying])::text[]))),
CONSTRAINT fk30k3slom60bw4qa6mfje04f0m FOREIGN KEY (user_id) REFERENCES public.users(id),
CONSTRAINT fkplqljgt097k2oym0nl26m7a8k FOREIGN KEY (post_id) REFERENCES public.posts(id)
);
CREATE INDEX idx_user_feed_created_at ON public.user_feed USING btree (created_at);
CREATE INDEX idx_user_feed_user_score ON public.user_feed USING btree (user_id, score DESC);

-- public."comments" definition

-- Drop table

-- DROP TABLE public."comments";

CREATE TABLE public."comments" (
id uuid NOT NULL,
created_at timestamptz(6) NOT NULL,
deleted_at timestamptz(6) NULL,
updated_at timestamptz(6) NOT NULL,
"content" varchar(1000) NOT NULL,
parent_id uuid NULL,
post_id uuid NOT NULL,
user_id uuid NOT NULL,
CONSTRAINT comments_pkey PRIMARY KEY (id),
CONSTRAINT fk8omq0tc18jd43bu5tjh6jvraq FOREIGN KEY (user_id) REFERENCES public.users(id),
CONSTRAINT fkh4c7lvsc298whoyd4w9ta25cr FOREIGN KEY (post_id) REFERENCES public.posts(id),
CONSTRAINT fklri30okf66phtcgbe5pok7cc0 FOREIGN KEY (parent_id) REFERENCES public."comments"(id)
);
CREATE INDEX idx_comments_created_at ON public.comments USING btree (created_at);
CREATE INDEX idx_comments_deleted_at ON public.comments USING btree (deleted_at);
CREATE INDEX idx_comments_parent_id ON public.comments USING btree (parent_id);
CREATE INDEX idx_comments_post_id ON public.comments USING btree (post_id);
CREATE INDEX idx_comments_user_id ON public.comments USING btree (user_id);

-- public.post_media definition

-- Drop table

-- DROP TABLE public.post_media;

CREATE TABLE public.post_media (
id uuid NOT NULL,
created_at timestamptz(6) NOT NULL,
deleted_at timestamptz(6) NULL,
updated_at timestamptz(6) NOT NULL,
duration_sec int4 NULL,
height int4 NULL,
media_type varchar(20) NOT NULL,
media_url text NOT NULL,
order_index int4 NOT NULL,
post_id uuid NOT NULL,
thumbnail_url text NULL,
width int4 NULL,
CONSTRAINT post_media_media_type_check CHECK (((media_type)::text = ANY ((ARRAY['IMAGE'::character varying, 'VIDEO'::character varying, 'GIF'::character varying])::text[]))),
CONSTRAINT post_media_pkey PRIMARY KEY (id),
CONSTRAINT fk1urcum9dtf0vgul7k405f4r2d FOREIGN KEY (post_id) REFERENCES public.posts(id)
);
CREATE INDEX idx_post_media_order ON public.post_media USING btree (post_id, order_index);
CREATE INDEX idx_post_media_post_id ON public.post_media USING btree (post_id);

-- public.post_stats definition

-- Drop table

-- DROP TABLE public.post_stats;

CREATE TABLE public.post_stats (
post_id uuid NOT NULL,
comment_count int4 NOT NULL,
like_count int4 NOT NULL,
reaction_count int4 NOT NULL,
share_count int4 NOT NULL,
updated_at timestamp(6) NOT NULL,
view_count int8 NOT NULL,
CONSTRAINT post_stats_pkey PRIMARY KEY (post_id),
CONSTRAINT fk_post_stats_post_id FOREIGN KEY (post_id) REFERENCES public.posts(id)
);
CREATE INDEX idx_post_stats_like_count ON public.post_stats USING btree (like_count);
CREATE INDEX idx_post_stats_view_count ON public.post_stats USING btree (view_count);

-- public.post_topics definition

-- Drop table

-- DROP TABLE public.post_topics;

CREATE TABLE public.post_topics (
id uuid NOT NULL,
created_at timestamptz(6) NOT NULL,
post_id uuid NOT NULL,
topic_id uuid NOT NULL,
CONSTRAINT post_topics_pkey PRIMARY KEY (id),
CONSTRAINT uk_post_topics_post_topic UNIQUE (post_id, topic_id),
CONSTRAINT fkchwf9bd8277uufn2qrqko4mvh FOREIGN KEY (topic_id) REFERENCES public.topics(id),
CONSTRAINT fkfl323yis9ff19pj7xiemmyyhh FOREIGN KEY (post_id) REFERENCES public.posts(id)
);
CREATE INDEX idx_post_topics_created_at ON public.post_topics USING btree (created_at);
CREATE INDEX idx_post_topics_post_id ON public.post_topics USING btree (post_id);
CREATE INDEX idx_post_topics_topic_id ON public.post_topics USING btree (topic_id);
