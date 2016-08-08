package com.imchuan.dto.sys;

import com.imchuan.api.pojo.BaseDto;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-21 15:59
 */
public class SysMenuDto extends BaseDto {
    private String name;
    private String url;
    private String queue;
    private String parentId;
    private String parentName;
    private String remark;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getQueue() {
        return queue;
    }

    public void setQueue(String queue) {
        this.queue = queue;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
