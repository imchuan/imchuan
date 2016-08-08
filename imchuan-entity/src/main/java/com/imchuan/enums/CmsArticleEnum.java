package com.imchuan.enums;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-30 19:50
 */
public class CmsArticleEnum {
    public enum Status {
        /**
         * 新增状态
         */
        NEW("NEW"),
        /**
         * 已下架
         */
        UNRELEASED("UNRELEASED"),
        /**
         * 已发布
         */
        RELEASED("RELEASED");

        private String value;

        Status(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

}
