package com.imchuan.api.pojo;

import java.io.Serializable;
import java.util.List;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-10 19:19
 */
public class Pagination<T> implements Serializable {
    private static final long serialVersionUID = 8460803312392136616L;
    private List<T> rows;
    private long total;
    private int page;
    private int size;

    public Pagination() {
    }

    public Pagination(Integer page, Integer size) {
        this.page = page;
        this.size = size;
    }


    public List<T> getRows() {
        return rows;
    }

    public void setRows(List<T> rows) {
        this.rows = rows;
    }

    public long getTotal() {
        if (total < 0) {
            return 0;
        }
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public int getPage() {
        if (page < 0) {
            return 0;
        }
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }
}
