package com.imchuan.service.cms.impl;

import com.imchuan.api.pojo.Select2;
import com.imchuan.api.pojo.TreeNode;
import com.imchuan.api.service.impl.BaseServiceImpl;
import com.imchuan.conversion.cms.CmsCategoryToDtoConverter;
import com.imchuan.conversion.cms.CmsCategoryToModelConverter;
import com.imchuan.conversion.cms.CmsCategoryToSelect2Converter;
import com.imchuan.conversion.cms.CmsCategoryToTreeConverter;
import com.imchuan.domian.cms.CmsCategoryDomain;
import com.imchuan.dto.cms.CmsCategoryDto;
import com.imchuan.entity.cms.CmsCategory;
import com.imchuan.service.cms.CmsCategoryService;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.Query;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.List;
import java.util.Objects;

/**
 * 栏目
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-30 16:29
 */
@Transactional
@Service("cmsCategoryService")
public class CmsCategoryServiceImpl extends BaseServiceImpl<CmsCategory, CmsCategoryDto, String> implements CmsCategoryService {

    @Resource
    private CmsCategoryToDtoConverter cmsCategoryToDtoConverter;
    @Resource
    private CmsCategoryToModelConverter cmsCategoryToModelConverter;
    @Resource
    private CmsCategoryToTreeConverter cmsCategoryToTreeConverter;
    @Resource
    private CmsCategoryToSelect2Converter cmsCategoryToSelect2Converter;

    @Override
    @PostConstruct
    public void initConverter() {
        super.setConverter(cmsCategoryToModelConverter, cmsCategoryToDtoConverter);
    }

    /**
     * 获取根
     *
     * @return
     */
    @Override
    public CmsCategory getRootCategory() {
        return super.getBaseDao().findOne(CmsCategory.class, Restrictions.isNull(CmsCategoryDomain.PARENT_ID));
    }

    /**
     * 获取子栏目
     *
     * @param pid
     * @return
     */
    @Override
    public List<TreeNode> getChildrens(final String pid) {
        final List<CmsCategory> list = getCategoryByParent(pid);
        return cmsCategoryToTreeConverter.convertAll(list);
    }

    /**
     * 构建树形数据
     *
     * @param pid 父节点id
     * @return
     */
    @Override
    public TreeNode buildMenuTree(String pid) {
        final CmsCategory cmsCategory = super.getBaseDao().get(CmsCategory.class, pid);
        TreeNode node = cmsCategoryToTreeConverter.convert(cmsCategory);
        List<TreeNode> childrens = getChildrens(pid);
        if (childrens.size() > 0) {
            node.setIsParent(true);
            node.setOpen(true);
        }
        for (TreeNode child : childrens) {
            TreeNode n = buildMenuTree(child.getId());
            node.getChildren().add(n);
        }
        return node;
    }

    /**
     * 获取树数据
     *
     * @return
     */
    @Override
    public TreeNode getTree() {
        final CmsCategory cmsCategory = getRootCategory();
        if (Objects.nonNull(cmsCategory)) {
            return buildMenuTree(cmsCategory.getId());
        }
        return null;
    }

    /**
     * 根据父栏目获取子栏目
     *
     * @param pid
     * @return
     */
    @Override
    public List<CmsCategory> getCategoryByParent(final String pid) {
        List<CmsCategory> list;
        if (StringUtils.isNotBlank(pid)) {
            final StringBuilder hql = new StringBuilder(100);
            hql.append("from ").append(CmsCategoryDomain.TYPECODE);
            hql.append(" where ").append(CmsCategoryDomain.PARENT_ID).append("=:pid");
            hql.append(" order by ").append(CmsCategoryDomain.QUEUE);
            final Query query = super.getBaseDao().createQuery(hql.toString());
            query.setParameter("pid", pid);
            list = query.list();
        } else {
            list = super.getBaseDao().find(CmsCategory.class, Restrictions.isNull(CmsCategoryDomain.PARENT_ID));
        }
        return list;
    }

    /**
     * 构建栏目下拉框数据
     *
     * @param pid
     * @return
     */
    @Override
    public List<Select2> getSelect2Data(final String pid) {
        final List<CmsCategory> list = getCategoryByParent(pid);
        return cmsCategoryToSelect2Converter.convertAll(list);
    }

    @Override
    public List<CmsCategory> getByIds(final List<String> ids) {
        return super.getBaseDao().find(CmsCategory.class, Restrictions.in(CmsCategoryDomain.ID, ids));
    }
}
