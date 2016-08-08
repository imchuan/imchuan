package com.imchuan.enums;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-12-03 16:51
 */
public class CommonEnum {
    public enum Whether {
        /**
         * 是
         */
        YES("1"),
        /**
         * 否
         */
        NO("0");

        private String value;

        Whether(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
