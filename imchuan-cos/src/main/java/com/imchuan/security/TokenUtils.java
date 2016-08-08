package com.imchuan.security;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * 用户 token 工具类
 */
public class TokenUtils {

    /**
     * 用户md5加密的key
     */
    public static final String PRIVATE_KEY = "www.imchuan.com1204";
    public static final String COOKIE_KEY = "IMC";
    /**
     * token 连接字符
     */
    public static final String OPERATORS = ":";

    /**
     * token 过期时间为30天
     */
    public static final long EXPIRES = 1000L * 60 * 60 * 24 * 30;


    /**
     * 根据用户信息创建token
     *
     * @param userDetails
     * @return
     */
    public static String createToken(final UserDetails userDetails) {
        final long expires = System.currentTimeMillis() + EXPIRES;

        final StringBuilder token = new StringBuilder();
        token.append(userDetails.getUsername());
        token.append(OPERATORS);
        token.append(expires);
        token.append(OPERATORS);
        token.append(TokenUtils.computeSignature(userDetails, expires));

        return token.toString();
    }


    /**
     * 计算签名串
     *
     * @param userDetails
     * @param expires
     * @return
     */
    public static String computeSignature(final UserDetails userDetails, final long expires) {
        final StringBuilder signature = new StringBuilder();
        signature.append(userDetails.getUsername());
        signature.append(OPERATORS);
        signature.append(expires);
        signature.append(OPERATORS);
        signature.append(userDetails.getPassword());
        signature.append(OPERATORS);
        signature.append(PRIVATE_KEY);

        return DigestUtils.md5Hex(signature.toString().getBytes());
    }

    /**
     * 从token中获取用户名
     *
     * @param authToken token
     * @return 用户id
     */
    public static String getUserNameByToken(final String authToken) {
        if (StringUtils.isNotBlank(authToken)) {
            return authToken.split(OPERATORS)[0];
        }
        return null;
    }

    /**
     * 验证token有效性
     *
     * @param authToken   token
     * @param userDetails 用户信息
     * @return
     */
    public static boolean validateToken(final String authToken, final UserDetails userDetails) {
        final String[] parts = authToken.split(OPERATORS);
        final long expires = Long.parseLong(parts[1]);
        final String signature = parts[2];
        //已过期
        if (expires < System.currentTimeMillis()) {
            return false;
        }
        return signature.equals(TokenUtils.computeSignature(userDetails, expires));
    }

}