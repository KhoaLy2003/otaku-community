--liquibase formatted sql

--changeset khoa:003-admin-features
-- public.reports definition
CREATE TABLE public.reports
(
    id              uuid         NOT NULL,
    created_at      timestamptz(6) NOT NULL,
    deleted_at      timestamptz(6) NULL,
    updated_at      timestamptz(6) NOT NULL,
    details         text NULL,
    moderator_notes text NULL,
    reason          varchar(255) NOT NULL,
    status          varchar(255) NOT NULL,
    target_id       varchar(255) NOT NULL,
    target_type     varchar(255) NOT NULL,
    moderator_id    uuid NULL,
    reporter_id     uuid         NOT NULL,
    CONSTRAINT reports_pkey PRIMARY KEY (id),
    CONSTRAINT reports_status_check CHECK (status::text = ANY (ARRAY['PENDING'::text, 'UNDER_REVIEW'::text, 'RESOLVED'::text, 'DISMISSED'::text])
) ,
    CONSTRAINT reports_reason_check CHECK (reason::text = ANY (ARRAY['SPAM'::text, 'HARASSMENT'::text, 'TOXICITY'::text, 'LOW_QUALITY'::text, 'COPYRIGHT'::text, 'NSFW'::text, 'OTHER'::text])),
    CONSTRAINT reports_target_type_check CHECK (target_type::text = ANY (ARRAY['USER'::text, 'POST'::text, 'COMMENT'::text, 'IP_ADDRESS'::text, 'TRANSLATION'::text, 'REPORT'::text, 'SYSTEM_CONFIG'::text])),
    CONSTRAINT fk_reports_moderator FOREIGN KEY (moderator_id) REFERENCES public.users (id),
    CONSTRAINT fk_reports_reporter FOREIGN KEY (reporter_id) REFERENCES public.users (id)
);
CREATE INDEX idx_reports_reporter_id ON public.reports (reporter_id);
CREATE INDEX idx_reports_target_id ON public.reports (target_id);
CREATE INDEX idx_reports_status ON public.reports (status);

-- public.system_configs definition
CREATE TABLE public.system_configs
(
    id           uuid         NOT NULL,
    created_at   timestamptz(6) NOT NULL,
    deleted_at   timestamptz(6) NULL,
    updated_at   timestamptz(6) NOT NULL,
    config_key   varchar(255) NOT NULL,
    config_value text NULL,
    description  varchar(255) NULL,
    CONSTRAINT system_configs_pkey PRIMARY KEY (id),
    CONSTRAINT uk_system_configs_key UNIQUE (config_key)
);

-- Update activity_logs constraints
ALTER TABLE public.activity_logs DROP CONSTRAINT activity_logs_action_type_check;
ALTER TABLE public.activity_logs
    ADD CONSTRAINT activity_logs_action_type_check
        CHECK (action_type::text = ANY (ARRAY['LOGIN'::text, 'LOGOUT'::text, 'CREATE_POST'::text, 'UPDATE_POST'::text, 'DELETE_POST'::text, 'CREATE_COMMENT'::text, 'UPDATE_COMMENT'::text, 'DELETE_COMMENT'::text, 'LIKE_POST'::text, 'UNLIKE_POST'::text, 'FOLLOW_USER'::text, 'UNFOLLOW_USER'::text, 'UPDATE_PROFILE'::text, 'UPLOAD_TRANSLATION'::text, 'PUBLISH_TRANSLATION'::text, 'DELETE_TRANSLATION'::text, 'BAN_USER'::text, 'UNBAN_USER'::text, 'LOCK_USER'::text, 'UNLOCK_USER'::text, 'UPDATE_USER_ROLE'::text, 'RESOLVE_REPORT'::text, 'DISMISS_REPORT'::text, 'MODERATE_POST'::text, 'MODERATE_COMMENT'::text, 'UPDATE_SYSTEM_CONFIG'::text]));

ALTER TABLE public.activity_logs DROP CONSTRAINT activity_logs_target_type_check;
ALTER TABLE public.activity_logs
    ADD CONSTRAINT activity_logs_target_type_check
        CHECK (target_type::text = ANY (ARRAY['USER'::text, 'POST'::text, 'COMMENT'::text, 'IP_ADDRESS'::text, 'TRANSLATION'::text, 'REPORT'::text, 'SYSTEM_CONFIG'::text]));

--changeset khoa:004-user-roles-and-lock
-- Add is_locked to users
ALTER TABLE public.users
    ADD COLUMN is_locked bool NOT NULL DEFAULT false;