package com.imchuan.service.cms;

import com.imchuan.api.pojo.Select2;
import com.imchuan.api.pojo.TreeNode;
import com.imchuan.api.service.BaseService;
import com.imchuan.dto.cms.CmsCategoryDto;
import com.imchuan.entity.cms.CmsCategory;

import java.util.List;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-10 20:34
 */
public interface CmsCategoryService extends BaseService<CmsCategory, CmsCategoryDto, String> {
    /**
     * 获取根
     *
     * @return
     */
    CmsCategory getRootCategory();

    /**
     * 获取子栏目
     *
     * @param pid
     * @return
     */
    List<TreeNode> getChildrens(final String pid);

    /**
     * 构建树形数据
     *
     * @param pid 父节点id
     * @return
     */
    TreeNode buildMenuTree(final String pid);

    /**
     * 获取树数据
     *
     * @return
     */
    TreeNode getTree();

    /**
     * 根据父栏目获取子栏目
     *
     * @param pid
     * @return
     */
    List<CmsCategory> getCategoryByParent(final String pid);

    /**
     * 构建栏目下拉框数据
     *
     * @param pid
     * @return
     */
    List<Select2> getSelect2Data(final String pid);

    List<CmsCategory> getByIds(final List<String> ids);

}