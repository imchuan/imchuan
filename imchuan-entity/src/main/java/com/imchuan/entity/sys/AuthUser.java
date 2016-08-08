package com.imchuan.entity.sys;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-10 20:58
 */
public class AuthUser implements UserDetails {
    private String uid;
    private String username;
    private String password;
    private Set<SysRole> roles;
    private String email;
    private String mobile;
    private Date lastLoginTime;
    private String loginIp;
    private String status;
    private String remark;
    private String nickName;


    public AuthUser(String username, String password, Set<SysRole> roles) {
        this.username = username;
        this.password = password;
        this.roles = roles;
    }

    public Set<SysRole> getRoles() {
        return roles;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<SysRole> roles = getRoles();

        if (roles == null) {
            return Collections.emptyList();
        }

        Set<GrantedAuthority> authorities = roles.stream().map((role) -> new SimpleGrantedAuthority(role.getCode())).collect(Collectors.toSet());

        return authorities;
    }

    /**
     * Returns the password used to authenticate the user.
     *
     * @return the password
     */
    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
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

    public Date getLastLoginTime() {
        return lastLoginTime;
    }

    public void setLastLoginTime(Date lastLoginTime) {
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

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }
}
