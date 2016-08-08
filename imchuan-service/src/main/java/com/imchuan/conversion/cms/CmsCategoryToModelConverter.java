package com.imchuan.conversion.cms;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.dto.cms.CmsCategoryDto;
import com.imchuan.entity.cms.CmsCategory;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;


@Component("cmsCategoryToModelConverter")
public class CmsCategoryToModelConverter extends AbstractConverter<CmsCategoryDto, CmsCategory> {

    @Override
    public CmsCategory convert(CmsCategoryDto source) throws ConversionException {
        final CmsCategory target = super.getTarget();
        populate(source, target);
        return target;
    }

    @Override
    public void populate(CmsCategoryDto source, CmsCategory target) {
        if (StringUtils.isNotBlank(source.getCode())) {
            target.setCode(source.getCode());
        }
        if (StringUtils.isNotBlank(source.getName())) {
            target.setName(source.getName());
        }
        if (StringUtils.isNotBlank(source.getUrl())) {
            target.setUrl(source.getUrl());
        }
        if (StringUtils.isNotBlank(source.getQueue())) {
            target.setQueue(Integer.valueOf(source.getQueue()));
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
