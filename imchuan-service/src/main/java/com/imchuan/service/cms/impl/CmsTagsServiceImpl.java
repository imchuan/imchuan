package com.imchuan.service.cms.impl;

import com.imchuan.api.pojo.Select2;
import com.imchuan.api.service.impl.BaseServiceImpl;
import com.imchuan.conversion.cms.CmsTagsToDtoConverter;
import com.imchuan.conversion.cms.CmsTagsToModelConverter;
import com.imchuan.conversion.cms.CmsTagsToSelect2Converter;
import com.imchuan.domian.cms.CmsTagsDomain;
import com.imchuan.dto.cms.CmsTagsDto;
import com.imchuan.entity.cms.CmsTags;
import com.imchuan.service.cms.CmsTagsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.List;
import java.util.Objects;

/**
 * 标签
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-12-03 15:36
 */
@Transactional
@Service("cmsTagsService")
public class CmsTagsServiceImpl extends BaseServiceImpl<CmsTags, CmsTagsDto, String> implements CmsTagsService {

    @Resource
    private CmsTagsToDtoConverter cmsTagsToDtoConverter;
    @Resource
    private CmsTagsToModelConverter cmsTagsToModelConverter;
    @Resource
    private CmsTagsToSelect2Converter cmsTagsToSelect2Converter;

    @Override
    @PostConstruct
    public void initConverter() {
        super.setConverter(cmsTagsToModelConverter, cmsTagsToDtoConverter);
    }

    /**
     * 获取所有标签
     *
     * @return
     */
    @Override
    public List<Select2> getSelect2Data() {
        final List<CmsTags> cmsTagses = super.getBaseDao().findAll(CmsTags.class);
        return cmsTagsToSelect2Converter.convertAll(cmsTagses);
    }

    /**
     * 保存
     *
     * @param tagNames
     */
    @Override
    public void saveTags(final List<String> tagNames) {
        for (final String tagName : tagNames) {
            final CmsTagsDto cmsTagsDto = super.findOneByProperty(CmsTagsDomain.NAME, tagName);
            if (Objects.nonNull(cmsTagsDto)) {
                continue;
            }
            final CmsTags cmsTags = getBaseDao().create(CmsTags.class);
            cmsTags.setName(tagName);
            getBaseDao().save(cmsTags);
        }
    }
}
