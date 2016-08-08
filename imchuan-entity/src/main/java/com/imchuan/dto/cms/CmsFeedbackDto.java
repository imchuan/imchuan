package com.imchuan.dto.cms;

import com.imchuan.api.pojo.BaseDto;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-30 16:05
 */
public class CmsFeedbackDto extends BaseDto {
    private String title;
    private String content;
    private String email;
    private String status;
    private String remark;
    private String replyTime;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getReplyTime() {
        return replyTime;
    }

    public void setReplyTime(String replyTime) {
        this.replyTime = replyTime;
    }
}
