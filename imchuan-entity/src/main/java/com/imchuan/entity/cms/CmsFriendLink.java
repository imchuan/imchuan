package com.imchuan.entity.cms;

import com.imchuan.api.pojo.AbstractEntity;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-30 15:49
 */
@Entity
@Table(name = "cms_friend_link", schema = "imc", catalog = "")
public class CmsFriendLink extends AbstractEntity {
    private String url;
    private String name;
    private String proposerEmail;
    private String logoUrl;
    private String status;
    private String remark;

    @Basic
    @Column(name = "url")
    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @Basic
    @Column(name = "name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Basic
    @Column(name = "proposer_email")
    public String getProposerEmail() {
        return proposerEmail;
    }

    public void setProposerEmail(String proposerEmail) {
        this.proposerEmail = proposerEmail;
    }

    @Basic
    @Column(name = "logo_url")
    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    @Basic
    @Column(name = "status")
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Basic
    @Column(name = "remark")
    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

}
