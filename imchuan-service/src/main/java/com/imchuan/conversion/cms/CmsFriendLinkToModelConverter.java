package com.imchuan.conversion.cms;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.dto.cms.CmsFriendLinkDto;
import com.imchuan.dto.cms.CmsFriendLinkDto;
import com.imchuan.entity.cms.CmsFriendLink;
import com.imchuan.entity.cms.CmsFriendLink;
import org.springframework.stereotype.Component;


@Component("cmsFriendLinkToModelConverter")
public class CmsFriendLinkToModelConverter extends AbstractConverter<CmsFriendLinkDto, CmsFriendLink> {

    @Override
    public CmsFriendLink convert(CmsFriendLinkDto source) throws ConversionException {
        final CmsFriendLink target = super.getTarget();
        populate(source, target);
        return target;
    }

    @Override
    public void populate(CmsFriendLinkDto source, CmsFriendLink target) {

    }
}
