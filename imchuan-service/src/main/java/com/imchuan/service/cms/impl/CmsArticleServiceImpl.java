package com.imchuan.service.cms.impl;

import com.google.common.collect.Lists;
import com.imchuan.api.front.AppResponse;
import com.imchuan.api.front.AppResult;
import com.imchuan.api.front.AppStatus;
import com.imchuan.api.pojo.GridExample;
import com.imchuan.api.pojo.Pagination;
import com.imchuan.api.service.impl.BaseServiceImpl;
import com.imchuan.conversion.cms.CmsArticleToDtoConverter;
import com.imchuan.conversion.cms.CmsArticleToModelConverter;
import com.imchuan.domian.cms.CmsArticleDomain;
import com.imchuan.dto.cms.CmsArticleDto;
import com.imchuan.entity.cms.CmsArticle;
import com.imchuan.entity.cms.CmsCategory;
import com.imchuan.entity.sys.AuthUser;
import com.imchuan.enums.CmsArticleEnum;
import com.imchuan.enums.CommonEnum;
import com.imchuan.service.cms.CmsArticleService;
import com.imchuan.service.cms.CmsCategoryService;
import com.imchuan.service.cms.CmsTagsService;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.Disjunction;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 文章管理
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-30 20:02
 */
@Transactional
@Service("cmsArticleService")
public class CmsArticleServiceImpl extends BaseServiceImpl<CmsArticle, CmsArticleDto, String> implements CmsArticleService {
    @Resource
    private CmsArticleToDtoConverter cmsArticleToDtoConverter;
    @Resource
    private CmsArticleToModelConverter cmsArticleToModelConverter;
    @Resource
    private CmsCategoryService cmsCategoryService;
    @Resource
    private CmsTagsService cmsTagsService;

    @Override
    @PostConstruct
    public void initConverter() {
        super.setConverter(cmsArticleToModelConverter, cmsArticleToDtoConverter);
    }

    /**
     * 新增文章
     *
     * @param cmsArticleDto
     */
    @Override
    public CmsArticleDto saveArticle(final CmsArticleDto cmsArticleDto) {
        // 获取栏目
        final List<CmsCategory> cmsCategories = cmsCategoryService.getByIds(Lists.newArrayList(cmsArticleDto.getCategoryIds().split(",")));
        final CmsArticle cmsArticle = getBaseDao().create(CmsArticle.class);
        cmsArticleToModelConverter.setTarget(cmsArticle);
        final CmsArticle cmsArticleNew = cmsArticleToModelConverter.convert(cmsArticleDto);

        cmsArticleNew.setStatus(CmsArticleEnum.Status.NEW.getValue());
        cmsArticleNew.setArticleNo(getMaxNo());
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        final AuthUser authUser = (AuthUser) authentication.getPrincipal();
        if (Objects.nonNull(authUser)) {
            cmsArticleNew.setAuthor(authUser.getNickName());
        }
        cmsArticleNew.setCategories(new HashSet<>(cmsCategories));
        final String id = getBaseDao().save(cmsArticleNew);
        // 保存标签
        if (StringUtils.isNotBlank(cmsArticleDto.getTags())) {
            final String[] tmp = cmsArticleDto.getTags().split(",");
            if (tmp != null && tmp.length > 0) {
                cmsTagsService.saveTags(Lists.newArrayList(tmp));
            }
        }
        return super.get(id);
    }

    /**
     * 更新文章
     *
     * @param cmsArticleDto
     * @return
     */
    @Override
    public CmsArticleDto updateArticle(final CmsArticleDto cmsArticleDto) {
        // 获取栏目
        final List<CmsCategory> cmsCategories = cmsCategoryService.getByIds(Lists.newArrayList(cmsArticleDto.getCategoryIds().split(",")));
        final CmsArticle cmsArticle = getBaseDao().get(CmsArticle.class, cmsArticleDto.getId());
        cmsArticleToModelConverter.setTarget(cmsArticle);
        final CmsArticle cmsArticleNew = cmsArticleToModelConverter.convert(cmsArticleDto);

        cmsArticleNew.setCategories(new HashSet<>(cmsCategories));
        getBaseDao().update(cmsArticleNew);
        // 保存标签
        if (StringUtils.isNotBlank(cmsArticleDto.getTags())) {
            final String[] tmp = cmsArticleDto.getTags().split(",");
            if (tmp != null && tmp.length > 0) {
                cmsTagsService.saveTags(Lists.newArrayList(tmp));
            }
        }
        return super.get(cmsArticleDto.getId());
    }

    /**
     * 查询列表
     *
     * @param condition   查询条件
     * @param gridExample 表格属性
     * @return
     */
    @Override
    public Pagination<CmsArticleDto> getList(final CmsArticleDto condition, final GridExample gridExample) {
        final Criteria criteria = super.createCriteria();
        // 编号
        if (StringUtils.isNotBlank(condition.getArticleNo())) {
            criteria.add(Restrictions.eq(CmsArticleDomain.ARTICLE_NO, new Integer(condition.getArticleNo())));
        }
        // 标题模糊
        if (StringUtils.isNotBlank(condition.getTitle())) {
            criteria.add(Restrictions.like(CmsArticleDomain.TITLE, "%" + condition.getTitle() + "%"));
        }

        // 标签
        if (StringUtils.isNotBlank(condition.getTags())) {
            final String[] tags = condition.getTags().split(",");
            Disjunction tagsCondition = Restrictions.disjunction();
            for (String tag : tags) {
                tagsCondition.add(Restrictions.like(CmsArticleDomain.TAGS, "%" + tag + "%"));
            }
            criteria.add(tagsCondition);
        }
        // 是否置顶
        if (StringUtils.isNotBlank(condition.getIsTop())) {
            criteria.add(Restrictions.eq(CmsArticleDomain.IS_TOP, condition.getIsTop()));
        }
        // 栏目
        if (StringUtils.isNotBlank(condition.getCategoryIds())) {
            final List<CmsCategory> categories = cmsCategoryService.getByIds(Lists.newArrayList(condition.getCategoryIds().split(",")));
            Set<String> articleIds = new HashSet<>();
            for (final CmsCategory cmsCategory : categories) {
                final Set<CmsArticle> articles = cmsCategory.getArticles();
                articleIds.addAll(articles.stream().map(CmsArticle::getId).collect(Collectors.toList()));
            }
            criteria.add(Restrictions.in(CmsArticleDomain.ID, articleIds));
        }

        Long rowCount = (Long) criteria.setProjection(Projections.rowCount()).uniqueResult();
        criteria.setProjection(null);

        final String order = gridExample.getOrder();
        if (StringUtils.isNotBlank(gridExample.getSortName()) && StringUtils.isNotBlank(order)) {
            if ("asc".equals(order)) {
                criteria.addOrder(Order.asc(gridExample.getSortName()));
            } else {
                criteria.addOrder(Order.desc(gridExample.getSortName()));
            }
        }

        criteria.setFirstResult((gridExample.getPage() - 1) * gridExample.getSize());
        criteria.setMaxResults(gridExample.getSize());
        List<CmsArticle> result = criteria.list();
        Pagination pagination = new Pagination(gridExample.getPage(), gridExample.getSize());
        pagination.setRows(cmsArticleToDtoConverter.convertAll(result));
        pagination.setTotal(rowCount);
        return pagination;
    }

    /**
     * 获取文章最大编号
     *
     * @return
     */
    @Override
    public Integer getMaxNo() {
        final StringBuilder hql = new StringBuilder(100);
        hql.append(" select max(").append(CmsArticleDomain.ARTICLE_NO).append(") + 1").append(" from ").append(CmsArticleDomain.TYPECODE);

        final Query query = super.getBaseDao().createQuery(hql.toString());
        final Integer maxNo = (Integer) query.uniqueResult();
        if (maxNo != null) {
            return maxNo;
        }
        return 1;
    }

    /**
     * 数据校验
     *
     * @param cmsArticleDto
     * @return
     */
    @Override
    public AppResult validate(final CmsArticleDto cmsArticleDto) {
        if (StringUtils.isAnyBlank(cmsArticleDto.getCategoryIds(), cmsArticleDto.getTitle(), cmsArticleDto.getContent())) {
            return AppResponse.error(AppStatus.ERR_PARAMS, "栏目、标题或内容不能为空");
        }
        return null;
    }

    /**
     * 置顶
     *
     * @param ids 文章id列表
     */
    @Override
    public void toTop(final List<String> ids) {
        final StringBuilder hql = new StringBuilder();
        hql.append(" update ").append(CmsArticleDomain.TYPECODE).append(" set ").append(CmsArticleDomain.IS_TOP).append("=:isTop ");
        hql.append(" where ").append(CmsArticleDomain.ID).append(" in (:ids)");
        final Query query = super.getBaseDao().createQuery(hql.toString());
        query.setParameter("isTop", CommonEnum.Whether.YES.getValue());
        query.setParameterList("ids", ids);
        query.executeUpdate();
    }

    /**
     * 上架
     *
     * @param ids 文章id列表
     */
    @Override
    public void putAway(final List<String> ids) {
        final StringBuilder hql = new StringBuilder();
        hql.append(" update ").append(CmsArticleDomain.TYPECODE)
                .append(" set ").append(CmsArticleDomain.STATUS).append("=:status ")
                .append(",").append(CmsArticleDomain.PUBLISH_TIME).append("=:pTime");

        hql.append(" where ").append(CmsArticleDomain.ID).append(" in (:ids)");
        final Query query = super.getBaseDao().createQuery(hql.toString());
        query.setParameter("status", CmsArticleEnum.Status.RELEASED.getValue());
        query.setParameter("pTime", new Date());
        query.setParameterList("ids", ids);
        query.executeUpdate();
    }

    /**
     * 下架
     *
     * @param ids 文章id列表
     */
    @Override
    public void soldOut(final List<String> ids) {
        setArticleStatus(ids, CmsArticleEnum.Status.UNRELEASED);
    }

    /**
     * 设置文章状态
     *
     * @param ids    文章id列表
     * @param status 状态
     */
    private void setArticleStatus(final List<String> ids, final CmsArticleEnum.Status status) {
        final StringBuilder hql = new StringBuilder();
        hql.append(" update ").append(CmsArticleDomain.TYPECODE).append(" set ").append(CmsArticleDomain.STATUS).append("=:status ");
        hql.append(" where ").append(CmsArticleDomain.ID).append(" in (:ids)");
        final Query query = super.getBaseDao().createQuery(hql.toString());
        query.setParameter("status", status.getValue());
        query.setParameterList("ids", ids);
        query.executeUpdate();
    }
}
