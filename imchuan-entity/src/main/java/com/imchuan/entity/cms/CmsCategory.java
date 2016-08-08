package com.imchuan.entity.cms;

import com.imchuan.api.pojo.AbstractEntity;

import javax.persistence.*;
import java.util.Set;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-30 15:49
 */
@Entity
@Table(name = "cms_category", schema = "imc", catalog = "")
public class CmsCategory extends AbstractEntity {
    private String code;
    private String name;
    private String url;
    private Integer queue;
    private String parentId;
    private String parentName;
    private String remark;
    private Set<CmsArticle> articles;

    @Basic
    @Column(name = "code")
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
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
    @Column(name = "url")
    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @Basic
    @Column(name = "queue")
    public Integer getQueue() {
        return queue;
    }

    public void setQueue(Integer queue) {
        this.queue = queue;
    }

    @Basic
    @Column(name = "parent_id")
    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    @Basic
    @Column(name = "parent_name")
    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    @Basic
    @Column(name = "remark")
    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    @ManyToMany(mappedBy = "categories")
    public Set<CmsArticle> getArticles() {
        return articles;
    }

    public void setArticles(Set<CmsArticle> articles) {
        this.articles = articles;
    }
}
