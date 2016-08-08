package com.imchuan.dto.cms;

import com.imchuan.api.pojo.BaseDto;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-30 16:06
 */
public class CmsFriendLinkDto extends BaseDto {
    private String url;
    private String name;
    private String proposerEmail;
    private String logoUrl;
    private String status;
    private String remark;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProposerEmail() {
        return proposerEmail;
    }

    public void setProposerEmail(String proposerEmail) {
        this.proposerEmail = proposerEmail;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
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
}
