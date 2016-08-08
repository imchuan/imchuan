package com.imchuan.conversion.cms;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.dto.cms.CmsTagsDto;
import com.imchuan.entity.cms.CmsTags;
import org.springframework.stereotype.Component;


@Component("cmsTagsToModelConverter")
public class CmsTagsToModelConverter extends AbstractConverter<CmsTagsDto, CmsTags> {

    @Override
    public CmsTags convert(CmsTagsDto source) throws ConversionException {
        final CmsTags target = super.getTarget();
        populate(source, target);
        return target;
    }

    @Override
    public void populate(CmsTagsDto source, CmsTags target) {
        target.setName(source.getName());
    }
}
