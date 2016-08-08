package com.imchuan.conversion.sys;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.dto.sys.SysMenuDto;
import com.imchuan.entity.sys.SysMenu;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;


@Component("sysMenuToModelConverter")
public class SysMenuToModelConverter extends AbstractConverter<SysMenuDto, SysMenu> {


    @Override
    public SysMenu convert(SysMenuDto source) throws ConversionException {
        final SysMenu target = super.getTarget();
        this.populate(source, target);
        return target;
    }

    @Override
    public void populate(SysMenuDto source, SysMenu target) {

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
