package com.imchuan.dto.sys;

import com.imchuan.api.pojo.BaseDto;

import java.util.Set;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-19 17:22
 */
public class SysUserDto extends BaseDto {
    private String userName;
    private String password;
    private String email;
    private String mobile;
    private String lastLoginTime;
    private String loginIp;
    private String status;
    private String remark;
    private String nickName;
    private Set<SysRoleDto> roles;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getLastLoginTime() {
        return lastLoginTime;
    }

    public void setLastLoginTime(String lastLoginTime) {
        this.lastLoginTime = lastLoginTime;
    }

    public String getLoginIp() {
        return loginIp;
    }

    public void setLoginIp(String loginIp) {
        this.loginIp = loginIp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }
}
