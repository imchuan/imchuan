package com.imchuan.entity.sys;

import com.imchuan.api.pojo.AbstractEntity;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-10 20:58
 */
@Entity
@Table(name = "sys_user", schema = "", catalog = "imc")
public class SysUser extends AbstractEntity {
    private String userName;
    private String password;
    private String email;
    private String mobile;
    private Date lastLoginTime;
    private String loginIp;
    private String status;
    private String remark;
    private String nickName;
    private Set<SysRole> roles;

    @Basic
    @Column(name = "user_name", nullable = true, insertable = true, updatable = true, length = 50)
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    @Basic
    @Column(name = "password", nullable = true, insertable = true, updatable = true, length = 50)
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Basic
    @Column(name = "email", nullable = true, insertable = true, updatable = true, length = 30)
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Basic
    @Column(name = "mobile", nullable = true, insertable = true, updatable = true, length = 20)
    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    @Basic
    @Column(name = "last_login_time", nullable = true, insertable = true, updatable = true)
    public Date getLastLoginTime() {
        return lastLoginTime;
    }

    public void setLastLoginTime(Date lastLoginTime) {
        this.lastLoginTime = lastLoginTime;
    }

    @Basic
    @Column(name = "login_ip", nullable = true, insertable = true, updatable = true, length = 20)
    public String getLoginIp() {
        return loginIp;
    }

    public void setLoginIp(String loginIp) {
        this.loginIp = loginIp;
    }

    @Basic
    @Column(name = "status", nullable = true, insertable = true, updatable = true, length = 20)
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Basic
    @Column(name = "remark", nullable = true, insertable = true, updatable = true, length = 200)
    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    @Basic
    @Column(name = "nick_name", nullable = true, insertable = true, updatable = true, length = 50)
    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    @ManyToMany
    @JoinTable(name = "sys_user_role", joinColumns = {@JoinColumn(name = "user_id")}, inverseJoinColumns = {@JoinColumn(name = "role_id")})
    public Set<SysRole> getRoles() {
        return roles;
    }

    public void setRoles(Set<SysRole> roles) {
        this.roles = roles;
    }

}
