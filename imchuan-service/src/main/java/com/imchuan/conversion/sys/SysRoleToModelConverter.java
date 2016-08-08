package com.imchuan.conversion.sys;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.dto.sys.SysRoleDto;
import com.imchuan.entity.sys.SysRole;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-19 17:27
 */
@Component("sysRoleToModelConverter")
public class SysRoleToModelConverter extends AbstractConverter<SysRoleDto, SysRole> {

    @Override
    public SysRole convert(SysRoleDto source) throws ConversionException {
        final SysRole target = super.getTarget();
        this.populate(source, target);
        return target;
    }

    @Override
    public void populate(SysRoleDto source, SysRole target) {
        if (StringUtils.isNotBlank(source.getCode())) {
            target.setCode(source.getCode());
        }
        if (StringUtils.isNotBlank(source.getName())) {
            target.setName(source.getName());
        }
        if (StringUtils.isNotBlank(source.getRemark())) {
            target.setRemark(source.getRemark());
        }
    }
}
