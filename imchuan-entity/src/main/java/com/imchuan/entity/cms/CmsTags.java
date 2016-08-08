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
@Table(name = "cms_tags", schema = "imc", catalog = "")
public class CmsTags extends AbstractEntity {
    private String name;
    private String remark;

    @Basic
    @Column(name = "name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
