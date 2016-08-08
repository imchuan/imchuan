package com.imchuan.conversion.cms;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.api.pojo.Select2;
import com.imchuan.entity.cms.CmsTags;
import org.springframework.stereotype.Component;


@Component("cmsTagsToSelect2Converter")
public class CmsTagsToSelect2Converter extends AbstractConverter<CmsTags, Select2> {

    @Override
    public Select2 convert(CmsTags source) throws ConversionException {
        final Select2 target = new Select2();
        populate(source, target);
        return target;
    }

    @Override
    public void populate(CmsTags source, Select2 target) {
        target.setText(source.getName());
        target.setId(source.getId());
    }
}
