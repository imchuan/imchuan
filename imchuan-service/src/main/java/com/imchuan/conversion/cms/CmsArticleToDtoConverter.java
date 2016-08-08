package com.imchuan.conversion.cms;

import com.google.common.base.Joiner;
import com.google.common.collect.Lists;
import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.api.util.DateUitls;
import com.imchuan.dto.cms.CmsArticleDto;
import com.imchuan.entity.cms.CmsArticle;
import com.imchuan.entity.cms.CmsCategory;
import com.imchuan.enums.CmsArticleEnum;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;
import java.util.Set;


@Component("cmsArticleToDtoConverter")
public class CmsArticleToDtoConverter extends AbstractConverter<CmsArticle, CmsArticleDto> {

    @Override
    public CmsArticleDto convert(CmsArticle source) throws ConversionException {
        final CmsArticleDto target = new CmsArticleDto();
        populate(source, target);
        return target;
    }

    @Override
    public void populate(CmsArticle source, CmsArticleDto target) {
        if (StringUtils.isNotBlank(source.getId())) {
            target.setId(source.getId());
        }
        // 文章编号
        if (Objects.nonNull(source.getArticleNo())) {
            target.setArticleNo(String.valueOf(source.getArticleNo()));
        }
        // 标题
        if (StringUtils.isNotBlank(source.getTitle())) {
            target.setTitle(source.getTitle());
        }
        // 内容
        if (StringUtils.isNotBlank(source.getContent())) {
            target.setContent(source.getContent());
        }
        // 简介
        if (StringUtils.isNotBlank(source.getIntro())) {
            target.setIntro(source.getIntro());
        }
        // 作者
        if (StringUtils.isNotBlank(source.getAuthor())) {
            target.setAuthor(source.getAuthor());
        }
        // 标签
        if (StringUtils.isNotBlank(source.getTags())) {
            target.setTags(source.getTags());
        }
        // 页面描述
        if (StringUtils.isNotBlank(source.getDescription())) {
            target.setDescription(source.getDescription());
        }
        // 页面关键字
        if (StringUtils.isNotBlank(source.getKeywords())) {
            target.setKeywords(source.getKeywords());
        }
        // 页面标题
        if (StringUtils.isNotBlank(source.getPageTitle())) {
            target.setPageTitle(source.getPageTitle());
        }
        // 说明
        if (StringUtils.isNotBlank(source.getRemark())) {
            target.setRemark(source.getRemark());
        }
        // 是否置顶
        if (StringUtils.isNotBlank(source.getIsTop())) {
            target.setIsTop(source.getIsTop());
        }
        // 阅读数
        if (Objects.nonNull(source.getViewCount())) {
            target.setViewCount(String.valueOf(source.getViewCount()));
        }
        // 点赞数
        if (Objects.nonNull(source.getGoodCount())) {
            target.setGoodCount(String.valueOf(source.getGoodCount()));
        }
        // 状态
        final String status = source.getStatus();
        if (StringUtils.isNotBlank(status)) {
            target.setStatus(status);
            if (CmsArticleEnum.Status.NEW.getValue().equals(status)) {
                target.setStatusName("草稿");
            } else if (CmsArticleEnum.Status.RELEASED.getValue().equals(status)) {
                target.setStatusName("已上架");
            } else if (CmsArticleEnum.Status.UNRELEASED.getValue().equals(status)) {
                target.setStatusName("已下架");
            }

        }
        // 上架时间
        if (Objects.nonNull(source.getPublishTime())) {
            target.setPublishTime(DateFormatUtils.format(source.getPublishTime(), DateUitls.Format.YYYY_MM_DD_HH_MM));
        }
        if (Objects.nonNull(source.getCreatedTime())) {
            target.setCreatedTime(DateFormatUtils.format(source.getCreatedTime(), DateUitls.Format.YYYY_MM_DD_HH_MM));
        }
        // 所属分类
        final Set<CmsCategory> categories = source.getCategories();
        if (categories != null) {
            List<CmsCategory> categoryList = Lists.newArrayList(categories);
            final List<String> categoryIds = Lists.transform(categoryList, cmsCategory -> cmsCategory.getId());
            final List<String> categoryNames = Lists.transform(categoryList, cmsCategory -> cmsCategory.getName());
            final String categoryIdsStr = Joiner.on(",").join(categoryIds);
            final String categoryNamesStr = Joiner.on(",").join(categoryNames);
            target.setCategoryIds(categoryIdsStr);
            target.setCategoryNames(categoryNamesStr);
        }
    }
}
