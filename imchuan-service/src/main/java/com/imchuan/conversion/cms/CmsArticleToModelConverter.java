package com.imchuan.conversion.cms;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.dto.cms.CmsArticleDto;
import com.imchuan.entity.cms.CmsArticle;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;


@Component("cmsArticleToModelConverter")
public class CmsArticleToModelConverter extends AbstractConverter<CmsArticleDto, CmsArticle> {

    @Override
    public CmsArticle convert(CmsArticleDto source) throws ConversionException {
        final CmsArticle target = super.getTarget();
        populate(source, target);
        return target;
    }

    @Override
    public void populate(CmsArticleDto source, CmsArticle target) {
        // 文章编号
        if (StringUtils.isNotBlank(source.getArticleNo())) {
            target.setArticleNo(new Integer(source.getArticleNo()));
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
    }
}
