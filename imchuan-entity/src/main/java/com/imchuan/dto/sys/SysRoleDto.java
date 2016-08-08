package com.imchuan.dto.sys;

import com.imchuan.api.pojo.BaseDto;
import com.imchuan.entity.sys.SysResource;

import java.util.Set;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-19 17:22
 */
public class SysRoleDto extends BaseDto {
    private String name;
    private String code;
    private String remark;
    private Set<SysUserDto> users;
    private Set<SysResource> resources;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Set<SysUserDto> getUsers() {
        return users;
    }

    public void setUsers(Set<SysUserDto> users) {
        this.users = users;
    }

    public Set<SysResource> getResources() {
        return resources;
    }

    public void setResources(Set<SysResource> resources) {
        this.resources = resources;
    }
}
