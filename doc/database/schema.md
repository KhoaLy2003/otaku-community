-- public.chats definition

-- Drop table

-- DROP TABLE public.chats;

CREATE TABLE public.chats (
id uuid NOT NULL,
created_at timestamptz(6) NOT NULL,
deleted_at timestamptz(6) NULL,
updated_at timestamptz(6) NOT NULL,
user_a_id uuid NOT NULL,
user_b_id uuid NOT NULL,
CONSTRAINT chats_pkey PRIMARY KEY (id),
CONSTRAINT uk_chats_user_pair UNIQUE (user_a_id, user_b_id)
);
CREATE INDEX idx_chats_user_pair ON public.chats USING btree (user_a_id, user_b_id);

-- public.messages definition

-- Drop table

-- DROP TABLE public.messages;

CREATE TABLE public.messages (
id uuid NOT NULL,
created_at timestamptz(6) NOT NULL,
deleted_at timestamptz(6) NULL,
updated_at timestamptz(6) NOT NULL,
chat_id uuid NOT NULL,
"content" text NOT NULL,
is_deleted bool NOT NULL,
sender_id uuid NOT NULL,
status varchar(255) NOT NULL,
CONSTRAINT messages_pkey PRIMARY KEY (id),
CONSTRAINT messages_status_check CHECK (((status)::text = ANY ((ARRAY['SENT'::character varying, 'DELIVERED'::character varying, 'READ'::character varying])::text[])))
);
CREATE INDEX idx_messages_chat_id_created_at ON public.messages USING btree (chat_id, created_at DESC);
CREATE INDEX idx_messages_chat_id_cursor ON public.messages USING btree (chat_id, created_at, id);

-- public.notifications definition

-- Drop table

-- DROP TABLE public.notifications;

CREATE TABLE public.notifications (
id uuid NOT NULL,
created_at timestamptz(6) NOT NULL,
deleted_at timestamptz(6) NULL,
updated_at timestamptz(6) NOT NULL,
is_read bool NOT NULL,
notification_type varchar(255) NOT NULL,
preview varchar(255) NULL,
recipient_id uuid NOT NULL,
sender_id uuid NULL,
target_id uuid NULL,
target_type varchar(255) NULL,
CONSTRAINT notifications_notification_type_check CHECK (((notification_type)::text = ANY ((ARRAY['LIKE'::character varying, 'COMMENT'::character varying, 'REPLY'::character varying, 'FOLLOW'::character varying, 'UNFOLLOW'::character varying, 'MENTION'::character varying, 'SYSTEM'::character varying, 'MESSAGE'::character varying])::text[]))),
CONSTRAINT notifications_pkey PRIMARY KEY (id),
CONSTRAINT notifications_target_type_check CHECK (((target_type)::text = ANY ((ARRAY['POST'::character varying, 'COMMENT'::character varying, 'USER'::character varying, 'CHAT'::character varying])::text[])))
);
CREATE INDEX idx_notifications_recipient_created ON public.notifications USING btree (recipient_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON public.notifications USING btree (recipient_id);

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
cover_image_url text NULL,
profile_visibility varchar(20) NULL,
CONSTRAINT uk_6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email),
CONSTRAINT uk_6muhtnbpqcydo2lsv78rginj8 UNIQUE (auth0_id),
CONSTRAINT uk_r43af9ap4edm43mmtq01oddj6 UNIQUE (username),
CONSTRAINT users_pkey PRIMARY KEY (id),
CONSTRAINT users_profile_visibility_check CHECK (((profile_visibility)::text = ANY ((ARRAY['PUBLIC'::character varying, 'FOLLOWERS_ONLY'::character varying, 'PRIVATE'::character varying])::text[]))),
CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['USER'::character varying, 'ADMIN'::character varying])::text[])))
);
CREATE INDEX idx_users_deleted_at ON public.users USING btree (deleted_at);
CREATE INDEX idx_users_email ON public.users USING btree (email);
CREATE INDEX idx_users_username ON public.users USING btree (username);

-- public.activity_logs definition

-- Drop table

-- DROP TABLE public.activity_logs;

CREATE TABLE public.activity_logs (
id uuid NOT NULL,
created_at timestamptz(6) NOT NULL,
deleted_at timestamptz(6) NULL,
updated_at timestamptz(6) NOT NULL,
action_type varchar(50) NOT NULL,
metadata text NULL,
user_id uuid NOT NULL,
target_id varchar(255) NULL,
target_type varchar(255) NULL,
CONSTRAINT activity_logs_pkey PRIMARY KEY (id),
CONSTRAINT activity_logs_target_type_check CHECK (((target_type)::text = ANY ((ARRAY['USER'::character varying, 'POST'::character varying, 'COMMENT'::character varying, 'IP_ADDRESS'::character varying])::text[]))),
CONSTRAINT fk5bm1lt4f4eevt8lv2517soakd FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs USING btree (created_at);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs USING btree (user_id);

-- public.login_histories definition

-- Drop table

-- DROP TABLE public.login_histories;

CREATE TABLE public.login_histories (
id uuid NOT NULL,
created_at timestamptz(6) NOT NULL,
deleted_at timestamptz(6) NULL,
updated_at timestamptz(6) NOT NULL,
ip_address varchar(45) NULL,
user_agent text NULL,
user_id uuid NOT NULL,
CONSTRAINT login_history_pkey PRIMARY KEY (id),
CONSTRAINT fk20v0mimmdegh2afs39uixlxpm FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE INDEX idx_login_histories_created_at ON public.login_histories USING btree (created_at);
CREATE INDEX idx_login_histories_user_id ON public.login_histories USING btree (user_id);
CREATE INDEX idx_login_history_user_id ON public.login_histories USING btree (user_id);

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

-- public.user_favorites definition

-- Drop table

-- DROP TABLE public.user_favorites;

CREATE TABLE public.user_favorites (
id uuid NOT NULL,
created_at timestamptz(6) NOT NULL,
deleted_at timestamptz(6) NULL,
updated_at timestamptz(6) NOT NULL,
external_id int8 NOT NULL,
image_url varchar(255) NULL,
note varchar(500) NULL,
title varchar(512) NOT NULL,
"type" varchar(20) NOT NULL,
user_id uuid NOT NULL,
CONSTRAINT uk_user_favorites_user_type_external_id UNIQUE (user_id, type, external_id),
CONSTRAINT user_favorites_pkey PRIMARY KEY (id),
CONSTRAINT user_favorites_type_check CHECK (((type)::text = ANY ((ARRAY['ANIME'::character varying, 'MANGA'::character varying])::text[]))),
CONSTRAINT fk4sv7b9w9adr0fjnc4u10exlwm FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE INDEX idx_user_favorites_user_id ON public.user_favorites USING btree (user_id);
CREATE INDEX idx_user_favorites_user_type ON public.user_favorites USING btree (user_id, type);

-- public.user_main_favorites definition

-- Drop table

-- DROP TABLE public.user_main_favorites;

CREATE TABLE public.user_main_favorites (
id uuid NOT NULL,
created_at timestamptz(6) NOT NULL,
deleted_at timestamptz(6) NULL,
updated_at timestamptz(6) NOT NULL,
favorite_id int4 NOT NULL,
favorite_image_url varchar(255) NULL,
favorite_name varchar(255) NOT NULL,
favorite_reason varchar(200) NULL,
favorite_type varchar(255) NOT NULL,
user_id uuid NOT NULL,
CONSTRAINT uk_eekwa97at7428hnn1hxov45js UNIQUE (user_id),
CONSTRAINT user_main_favorites_favorite_type_check CHECK (((favorite_type)::text = ANY ((ARRAY['ANIME'::character varying, 'MANGA'::character varying, 'CHARACTER'::character varying])::text[]))),
CONSTRAINT user_main_favorites_pkey PRIMARY KEY (id),
CONSTRAINT fkp8q0r2efcqfq9kj8l159cb905 FOREIGN KEY (user_id) REFERENCES public.users(id)
);

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
image_url varchar(500) NULL,
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

-- public.post_references definition

-- Drop table

-- DROP TABLE public.post_references;

CREATE TABLE public.post_references (
id uuid NOT NULL,
created_at timestamptz(6) NOT NULL,
deleted_at timestamptz(6) NULL,
updated_at timestamptz(6) NOT NULL,
external_id int8 NOT NULL,
image_url varchar(255) NULL,
is_auto_linked bool NOT NULL,
reference_type varchar(20) NOT NULL,
title varchar(512) NULL,
post_id uuid NOT NULL,
CONSTRAINT post_references_pkey PRIMARY KEY (id),
CONSTRAINT post_references_reference_type_check CHECK (((reference_type)::text = ANY ((ARRAY['ANIME'::character varying, 'MANGA'::character varying])::text[]))),
CONSTRAINT fkf7cwrjcxl7wcp1vhpjklcq35d FOREIGN KEY (post_id) REFERENCES public.posts(id)
);
CREATE INDEX idx_post_ref_external_id ON public.post_references USING btree (external_id);
CREATE INDEX idx_post_ref_post_id ON public.post_references USING btree (post_id);
CREATE INDEX idx_post_ref_type_ext_id ON public.post_references USING btree (reference_type, external_id);

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
