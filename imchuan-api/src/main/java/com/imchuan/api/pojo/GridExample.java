package com.imchuan.api.pojo;

import java.io.Serializable;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-19 13:52
 */
public class GridExample implements Serializable {
    private static final long serialVersionUID = 3589997791357112677L;
    private String order;
    private String sortName;
    private Integer page;
    private Integer size;

    public String getOrder() {
        return order;
    }

    public void setOrder(String order) {
        this.order = order;
    }

    public String getSortName() {
        return sortName;
    }

    public void setSortName(String sortName) {
        this.sortName = sortName;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }
}
