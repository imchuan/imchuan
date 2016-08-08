package com.imchuan.conversion.sys;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.dto.sys.SysResourceDto;
import com.imchuan.entity.sys.SysResource;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-19 17:27
 */
@Component("sysResourceToModelConverter")
public class SysResourceToModelConverter extends AbstractConverter<SysResourceDto, SysResource> {

    @Override
    public SysResource convert(SysResourceDto source) throws ConversionException {
        final SysResource target = super.getTarget();
        this.populate(source, target);
        return target;
    }

    @Override
    public void populate(SysResourceDto source, SysResource target) {
        if (StringUtils.isNotBlank(source.getName())) {
            target.setName(source.getName());
        }
        if (StringUtils.isNotBlank(source.getUrl())) {
            target.setUrl(source.getUrl());
        }
        if (StringUtils.isNotBlank(source.getRemark())) {
            target.setRemark(source.getRemark());
        }
    }
}
