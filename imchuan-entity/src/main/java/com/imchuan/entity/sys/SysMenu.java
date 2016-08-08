package com.imchuan.entity.sys;

import com.imchuan.api.pojo.AbstractEntity;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-10 20:58
 */
@Entity
@Table(name = "sys_menu", schema = "", catalog = "imc")
public class SysMenu extends AbstractEntity{
    private String name;
    private String url;
    private Integer queue;
    private String parentId;
    private String parentName;
    private String remark;
    private Set<SysRole> roles;

    @Basic
    @Column(name = "name", nullable = true, insertable = true, updatable = true, length = 50)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Basic
    @Column(name = "url", nullable = true, insertable = true, updatable = true, length = 200)
    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @Basic
    @Column(name = "queue", nullable = true, insertable = true, updatable = true)
    public Integer getQueue() {
        return queue;
    }

    public void setQueue(Integer queue) {
        this.queue = queue;
    }

    @Basic
    @Column(name = "parent_id", nullable = true, insertable = true, updatable = true, length = 50)
    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    @Basic
    @Column(name = "parent_name", nullable = true, insertable = true, updatable = true, length = 50)
    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    @Basic
    @Column(name = "remark", nullable = true, insertable = true, updatable = true, length = 200)
    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    @ManyToMany(mappedBy = "menus")
    public Set<SysRole> getRoles() {
        return roles;
    }

    public void setRoles(Set<SysRole> roles) {
        this.roles = roles;
    }
}
