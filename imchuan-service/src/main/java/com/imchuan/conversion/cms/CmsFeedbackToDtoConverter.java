package com.imchuan.conversion.cms;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.dto.cms.CmsFeedbackDto;
import com.imchuan.entity.cms.CmsFeedback;
import org.springframework.stereotype.Component;


@Component("cmsFeedbackToDtoConverter")
public class CmsFeedbackToDtoConverter extends AbstractConverter<CmsFeedback, CmsFeedbackDto> {

    @Override
    public CmsFeedbackDto convert(CmsFeedback source) throws ConversionException {
        final CmsFeedbackDto target = new CmsFeedbackDto();
        populate(source, target);
        return target;
    }

    @Override
    public void populate(CmsFeedback source, CmsFeedbackDto target) {

    }
}
