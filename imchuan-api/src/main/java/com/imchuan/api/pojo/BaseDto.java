package com.imchuan.api.pojo;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-20 14:18
 */
public class BaseDto {
    private String id;
    private String createdTime;
    private String modifiedTime;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(String createdTime) {
        this.createdTime = createdTime;
    }

    public String getModifiedTime() {
        return modifiedTime;
    }

    public void setModifiedTime(String modifiedTime) {
        this.modifiedTime = modifiedTime;
    }
}
