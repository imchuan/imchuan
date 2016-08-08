package com.imchuan.conversion.cms;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.api.pojo.Select2;
import com.imchuan.entity.cms.CmsCategory;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;


@Component("cmsCategoryToSelect2Converter")
public class CmsCategoryToSelect2Converter extends AbstractConverter<CmsCategory, Select2> {

    @Override
    public Select2 convert(CmsCategory source) throws ConversionException {
        final Select2 target = new Select2();
        populate(source, target);
        return target;
    }

    @Override
    public void populate(CmsCategory source, Select2 target) {
        if (StringUtils.isNotBlank(source.getId())) {
            target.setId(source.getId());
        }
        if (StringUtils.isNotBlank(source.getName())) {
            target.setText(source.getName());
        }
    }
}
