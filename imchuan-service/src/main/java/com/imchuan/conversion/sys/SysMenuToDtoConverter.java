package com.imchuan.conversion.sys;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.api.util.DateUitls;
import com.imchuan.dto.sys.SysMenuDto;
import com.imchuan.entity.sys.SysMenu;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.springframework.stereotype.Component;

import java.util.Objects;


@Component("sysMenuToDtoConverter")
public class SysMenuToDtoConverter extends AbstractConverter<SysMenu, SysMenuDto> {

    @Override
    public SysMenuDto convert(SysMenu source) throws ConversionException {
        final SysMenuDto target = new SysMenuDto();
        populate(source, target);
        return target;
    }

    @Override
    public void populate(SysMenu source, SysMenuDto target) {
        if (Objects.nonNull(source.getId())) {
            target.setId(source.getId());
        }
        if (StringUtils.isNotBlank(source.getName())) {
            target.setName(source.getName());
        }
        if (StringUtils.isNotBlank(source.getUrl())) {
            target.setUrl(source.getUrl());
        }
        if (Objects.nonNull(source.getQueue())) {
            target.setQueue(String.valueOf(source.getQueue()));
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
        if (Objects.nonNull(source.getCreatedTime())) {
            target.setCreatedTime(DateFormatUtils.format(source.getCreatedTime(), DateUitls.Format.YYYY_MM_DD_HH_MM));
        }
    }
}
