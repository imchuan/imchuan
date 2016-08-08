package com.imchuan.entity.cms;

import com.imchuan.api.pojo.AbstractEntity;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-30 15:49
 */
@Entity
@Table(name = "cms_article", schema = "imc", catalog = "")
public class CmsArticle extends AbstractEntity {
    private Integer articleNo;
    private String author;
    private String title;
    private String content;
    private String intro;
    private String tags;
    private Integer viewCount;
    private Integer commentCount;
    private Integer goodCount;
    private Integer queue;
    private String status;
    private String description;
    private String keywords;
    private String pageTitle;
    private String remark;
    private Date publishTime;
    private String isTop;
    private Set<CmsCategory> categories;

    @Basic
    @Column(name = "article_no")
    public Integer getArticleNo() {
        return articleNo;
    }

    public void setArticleNo(Integer articleNo) {
        this.articleNo = articleNo;
    }

    @Basic
    @Column(name = "author")
    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    @Basic
    @Column(name = "title")
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Basic
    @Column(name = "content")
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Basic
    @Column(name = "intro")
    public String getIntro() {
        return intro;
    }

    public void setIntro(String intro) {
        this.intro = intro;
    }

    @Basic
    @Column(name = "tags")
    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    @Basic
    @Column(name = "view_count")
    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }

    @Basic
    @Column(name = "comment_count")
    public Integer getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(Integer commentCount) {
        this.commentCount = commentCount;
    }

    @Basic
    @Column(name = "good_count")
    public Integer getGoodCount() {
        return goodCount;
    }

    public void setGoodCount(Integer goodCount) {
        this.goodCount = goodCount;
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
    @Column(name = "status")
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Basic
    @Column(name = "description")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Basic
    @Column(name = "keywords")
    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    @Basic
    @Column(name = "page_title")
    public String getPageTitle() {
        return pageTitle;
    }

    public void setPageTitle(String pageTitle) {
        this.pageTitle = pageTitle;
    }

    @Basic
    @Column(name = "remark")
    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    @Basic
    @Column(name = "publish_time")
    public Date getPublishTime() {
        return publishTime;
    }

    public void setPublishTime(Date publishTime) {
        this.publishTime = publishTime;
    }

    @Basic
    @Column(name = "is_top")
    public String getIsTop() {
        return isTop;
    }

    public void setIsTop(String isTop) {
        this.isTop = isTop;
    }

    @ManyToMany
    @JoinTable(name = "cms_category_article", joinColumns = {@JoinColumn(name = "article_id")}, inverseJoinColumns = {@JoinColumn(name = "category_id")})
    public Set<CmsCategory> getCategories() {
        return categories;
    }

    public void setCategories(Set<CmsCategory> categories) {
        this.categories = categories;
    }
}
