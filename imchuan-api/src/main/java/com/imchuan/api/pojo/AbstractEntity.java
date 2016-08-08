package com.imchuan.api.pojo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-11 15:00
 */
@MappedSuperclass
public abstract class AbstractEntity {
    private String id;
    private Date createdTime;
    private Date modifiedTime;


    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    @Column(name = "id", nullable = false, insertable = true, updatable = true, length = 50)
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Column(name = "created_time", nullable = true, insertable = true, updatable = true)
    public Date getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(Date createdTime) {
        this.createdTime = createdTime;
    }

    @Column(name = "modified_time", nullable = true, insertable = true, updatable = true)
    public Date getModifiedTime() {
        return modifiedTime;
    }

    public void setModifiedTime(Date modifiedTime) {
        this.modifiedTime = modifiedTime;
    }

}
