package com.imchuan.conversion.cms;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.dto.cms.CmsCategoryDto;
import com.imchuan.entity.cms.CmsCategory;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.util.Objects;


@Component("cmsCategoryToDtoConverter")
public class CmsCategoryToDtoConverter extends AbstractConverter<CmsCategory, CmsCategoryDto> {

    @Override
    public CmsCategoryDto convert(CmsCategory source) throws ConversionException {
        final CmsCategoryDto target = new CmsCategoryDto();
        populate(source, target);
        return target;
    }

    @Override
    public void populate(CmsCategory source, CmsCategoryDto target) {
        if (StringUtils.isNotBlank(source.getId())) {
            target.setId(source.getId());
        }
        if (StringUtils.isNotBlank(source.getCode())) {
            target.setCode(source.getCode());
        }
        if (StringUtils.isNotBlank(source.getName())) {
            target.setName(source.getName());
        }
        if (StringUtils.isNotBlank(source.getUrl())) {
            target.setUrl(source.getUrl());
        }
        if (Objects.nonNull(source.getQueue())) {
            target.setQueue(String.valueOf(source.getQueue()));
        }
        if (StringUtils.isNotBlank(source.getParentId())) {
            target.setParentId(source.getParentId());
        }
        if (StringUtils.isNotBlank(source.getParentName())) {
            target.setParentName(source.getParentName());
        }
        if (StringUtils.isNotBlank(source.getRemark())) {
            target.setRemark(source.getRemark());
        }
    }
}
