package com.imchuan.dto.sys;

import com.imchuan.api.pojo.BaseDto;

import java.util.Set;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-20 15:56
 */
public class SysResourceDto extends BaseDto {
    private String name;
    private String url;
    private String remark;
    private Set<SysRoleDto> roles;

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

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Set<SysRoleDto> getRoles() {
        return roles;
    }

    public void setRoles(Set<SysRoleDto> roles) {
        this.roles = roles;
    }
}
