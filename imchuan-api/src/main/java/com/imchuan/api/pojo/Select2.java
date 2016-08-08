package com.imchuan.api.pojo;

import java.io.Serializable;

/**
 * select2 控件数据格式定义
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-12-03 15:19
 */
public class Select2 implements Serializable {
    private static final long serialVersionUID = 5392758907992273524L;
    private String id;
    private String text;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
