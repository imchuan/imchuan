package com.imchuan.conversion.cms;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.dto.cms.CmsFriendLinkDto;
import com.imchuan.entity.cms.CmsFriendLink;
import com.imchuan.entity.cms.CmsFriendLink;
import org.springframework.stereotype.Component;


@Component("cmsFriendLinkToDtoConverter")
public class CmsFriendLinkToDtoConverter extends AbstractConverter<CmsFriendLink, CmsFriendLinkDto> {

    @Override
    public CmsFriendLinkDto convert(CmsFriendLink source) throws ConversionException {
        final CmsFriendLinkDto target = new CmsFriendLinkDto();
        populate(source, target);
        return target;
    }

    @Override
    public void populate(CmsFriendLink source, CmsFriendLinkDto target) {

    }
}
