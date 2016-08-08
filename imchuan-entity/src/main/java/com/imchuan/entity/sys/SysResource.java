package com.imchuan.entity.sys;

import com.imchuan.api.pojo.AbstractEntity;

import javax.persistence.*;
import java.util.Set;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-10 20:58
 */
@Entity
@Table(name = "sys_resource", schema = "", catalog = "imc")
public class SysResource extends AbstractEntity {
    private String name;
    private String url;
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
    @Column(name = "remark", nullable = true, insertable = true, updatable = true, length = 200)
    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
    @ManyToMany(mappedBy = "resources")
    public Set<SysRole> getRoles() {
        return roles;
    }

    public void setRoles(Set<SysRole> roles) {
        this.roles = roles;
    }
}
