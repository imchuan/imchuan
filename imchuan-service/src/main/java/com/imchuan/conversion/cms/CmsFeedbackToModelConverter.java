package com.imchuan.conversion.cms;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.dto.cms.CmsFeedbackDto;
import com.imchuan.entity.cms.CmsFeedback;
import org.springframework.stereotype.Component;


@Component("cmsFeedbackToModelConverter")
public class CmsFeedbackToModelConverter extends AbstractConverter<CmsFeedbackDto, CmsFeedback> {

    @Override
    public CmsFeedback convert(CmsFeedbackDto source) throws ConversionException {
        final CmsFeedback target = super.getTarget();
        populate(source, target);
        return target;
    }

    @Override
    public void populate(CmsFeedbackDto source, CmsFeedback target) {

    }
}
