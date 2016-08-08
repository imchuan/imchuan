package com.imchuan.dto.cms;

import com.imchuan.api.pojo.BaseDto;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-30 16:07
 */
public class CmsTagsDto extends BaseDto {
    private String name;
    private String remark;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
