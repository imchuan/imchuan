package com.imchuan.conversion.sys;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.api.util.DateUitls;
import com.imchuan.dto.sys.SysRoleDto;
import com.imchuan.entity.sys.SysRole;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.springframework.stereotype.Component;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-19 17:27
 */
@Component("sysRoleToDtoConverter")
public class SysRoleToDtoConverter extends AbstractConverter<SysRole, SysRoleDto> {

    @Override
    public SysRoleDto convert(SysRole source) throws ConversionException {
        final SysRoleDto target = new SysRoleDto();
        this.populate(source, target);
        return target;
    }

    @Override
    public void populate(SysRole source, SysRoleDto target) {
        if (StringUtils.isNotBlank(source.getId())) {
            target.setId(source.getId());
        }
        if (StringUtils.isNotBlank(source.getCode())) {
            target.setCode(source.getCode());
        }
        if (StringUtils.isNotBlank(source.getName())) {
            target.setName(source.getName());
        }
        if (StringUtils.isNotBlank(source.getRemark())) {
            target.setRemark(source.getRemark());
        }
        if (null != source.getCreatedTime()) {
            target.setCreatedTime(DateFormatUtils.format(source.getCreatedTime(), DateUitls.Format.YYYY_MM_DD_HH_MM));
        }
        if (null != source.getModifiedTime()) {
            target.setModifiedTime(DateFormatUtils.format(source.getModifiedTime(), DateUitls.Format.YYYY_MM_DD_HH_MM));
        }
    }
}
