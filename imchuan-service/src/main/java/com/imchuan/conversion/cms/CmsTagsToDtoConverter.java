package com.imchuan.conversion.cms;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.dto.cms.CmsTagsDto;
import com.imchuan.entity.cms.CmsTags;
import org.springframework.stereotype.Component;


@Component("cmsTagsToDtoConverter")
public class CmsTagsToDtoConverter extends AbstractConverter<CmsTags, CmsTagsDto> {

    @Override
    public CmsTagsDto convert(CmsTags source) throws ConversionException {
        final CmsTagsDto target = new CmsTagsDto();
        populate(source, target);
        return target;
    }

    @Override
    public void populate(CmsTags source, CmsTagsDto target) {
        target.setName(source.getName());
        target.setId(source.getId());
    }
}
