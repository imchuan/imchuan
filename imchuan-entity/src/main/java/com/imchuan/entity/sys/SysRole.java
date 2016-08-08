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
@Table(name = "sys_role", schema = "", catalog = "imc")
public class SysRole extends AbstractEntity {
    private String name;
    private String code;
    private String remark;
    private Set<SysUser> users;
    private Set<SysResource> resources;
    private Set<SysMenu> menus;

    @Basic
    @Column(name = "name", nullable = true, insertable = true, updatable = true, length = 50)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Basic
    @Column(name = "code", nullable = true, insertable = true, updatable = true, length = 50)
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    @Basic
    @Column(name = "remark", nullable = true, insertable = true, updatable = true, length = 200)
    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    @ManyToMany(mappedBy = "roles")
    public Set<SysUser> getUsers() {
        return users;
    }

    public void setUsers(Set<SysUser> users) {
        this.users = users;
    }

    @ManyToMany
    @JoinTable(name = "sys_resource_role", joinColumns = {@JoinColumn(name = "role_id")}, inverseJoinColumns = {@JoinColumn(name = "resource_id")})
    public Set<SysResource> getResources() {
        return resources;
    }

    public void setResources(Set<SysResource> resources) {
        this.resources = resources;
    }

    @ManyToMany
    @JoinTable(name = "sys_menu_role", joinColumns = {@JoinColumn(name = "role_id")}, inverseJoinColumns = {@JoinColumn(name = "menu_id")})
    public Set<SysMenu> getMenus() {
        return menus;
    }

    public void setMenus(Set<SysMenu> menus) {
        this.menus = menus;
    }
}
