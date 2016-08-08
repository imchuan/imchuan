package com.imchuan.api.pojo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-10 19:19
 */
public class TreeNode implements Serializable {
    private static final long serialVersionUID = -5360066898843512135L;
    private String id;
    /**
     * 菜单代码
     */
    private String code;
    /**
     * 菜单名称
     */
    private String name;

    private String url;
    /**
     * 菜单路径
     */
    private String link;
    /**
     * 排序
     */
    private Integer queue;

    /**
     * 说明
     */
    private String remark;
    private String parentId;
    private String parentName;

    /**
     * 是否是父级
     */
    private Boolean isParent;

    /**
     * 是否展开
     */
    private Boolean open;
    private Boolean checked;

    /**
     * 子节点集合
     */
    private List<TreeNode> children = new ArrayList<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public Integer getQueue() {
        return queue;
    }

    public void setQueue(Integer queue) {
        this.queue = queue;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Boolean getIsParent() {
        return isParent;
    }

    public void setIsParent(Boolean isParent) {
        this.isParent = isParent;
    }

    public Boolean getOpen() {
        return open;
    }

    public void setOpen(Boolean open) {
        this.open = open;
    }

    public List<TreeNode> getChildren() {
        return children;
    }

    public void setChildren(List<TreeNode> children) {
        this.children = children;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public Boolean getChecked() {
        return checked;
    }

    public void setChecked(Boolean checked) {
        this.checked = checked;
    }
}
