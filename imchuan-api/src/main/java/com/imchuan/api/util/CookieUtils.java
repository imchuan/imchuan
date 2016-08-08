package com.imchuan.api.util;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Cookie 操作
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-12-12 09:43
 */
public class CookieUtils {
    private CookieUtils() {
    }

    /**
     * 添加cookie
     *
     * @param response HttpServletResponse
     * @param key      名称
     * @param value    值
     * @param expiry   有效期
     */
    public static void setCookie(final HttpServletResponse response, final String key, final String value, final int expiry) {
        Cookie cookie = new Cookie(key, value);
        cookie.setPath("/");
        if (expiry > 0) {
            cookie.setMaxAge(expiry);
        }
        response.addCookie(cookie);
    }

    /**
     * 根据名字获取cookie
     *
     * @param request HttpServletRequest
     * @param name    cookie名字
     * @return Cookie
     */
    public static Cookie getCookie(final HttpServletRequest request, final String name) {
        final Cookie[] cookies = request.getCookies();
        if (null != cookies) {
            for (final Cookie cookie : cookies) {
                if (cookie.getName().equals(name)) {
                    return cookie;
                }
            }
        }
        return null;
    }

}
