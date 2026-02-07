package com.otaku.community.common.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class CommonConstant {
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final int MAX_PAGE_SIZE = 100;

    public static final String ERR_MSG_USER_NOT_FOUND = "User not found";
    public static final String ERR_MSG_TRANSLATION_NOT_FOUND = "Translation not found";
}
