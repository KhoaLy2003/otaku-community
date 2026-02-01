package com.otaku.community.common.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class SecurityEndpoints {

    public static final String[] PUBLIC_GET = {
            "/health",
            "/docs/**",
            "/swagger-ui/**",
            "/api/feed/explore/**",
            "/api/v1/anime/**",
            "/api/v1/manga/**",
            "/api/v1/chapters/**",
            "/api/v1/translations/**",
            "/api/users/username/**"
    };

    public static final String[] PUBLIC_POST = {
            "/api/v1/translations/*/views**"
    };

    public static final String[] PUBLIC_ANY = {
            "/api/ws-registry/**",
            "/ws-registry/**",
            "/ws-native/**"
    };

    public static final String[] AUTHENTICATED = {
            "/posts/**",
            "/comments/**",
            "/likes/**",
            "/feed/home",
            "/feed/following",
            "/notifications/**",
            "/users/me/**",
            "/api/v1/chats/**"
    };

    public static final String[] ADMIN = {
            "/api/admin/**",
            "/admin/**"
    };
}
