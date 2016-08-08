package com.imchuan.api.util;

import org.jboss.jandex.Main;
import org.springframework.security.authentication.encoding.ShaPasswordEncoder;

/**
 * 密码工具类
 *
 * @author liuqq
 * @date 2015-10-22
 */
public class PasswordUtils {
    public static void main(String[] args) {
        final String password = encryptPassword("123123");
        System.out.println("password = " + password);
    }

    /**
     * 加密密码
     *
     * @param password 明文密码
     * @return 加密后的密码
     */
    public static String encryptPassword(final String password) {
        final ShaPasswordEncoder shaPasswordEncoder = new ShaPasswordEncoder(256);
        return shaPasswordEncoder.encodePassword(password, null);
    }

    /**
     * 比较密码是否相等
     *
     * @param original  原始密码，未加密
     * @param encrypted 加密后的密码
     * @return
     */
    public static boolean compare(final String original, final String encrypted) {
        return encrypted.equalsIgnoreCase(encryptPassword(original));
    }
}
