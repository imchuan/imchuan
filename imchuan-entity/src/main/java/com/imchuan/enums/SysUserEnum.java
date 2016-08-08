package com.imchuan.enums;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-13 18:01
 */
public class SysUserEnum {

    public enum Status{
        NORMAL("NORMAL"),
        DISABLED("DISABLED");

        private String code;

        private Status(final String statusCode) {
            this.code = statusCode;
        }

        public String getCode() {
            return this.code;
        }
    }
}
