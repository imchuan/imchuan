package com.imchuan.conversion.sys;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.api.util.DateUitls;
import com.imchuan.dto.sys.SysUserDto;
import com.imchuan.entity.sys.SysUser;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.springframework.stereotype.Component;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-19 17:27
 */
@Component("sysUserToDtoConverter")
public class SysUserToDtoConverter extends AbstractConverter<SysUser, SysUserDto> {

    @Override
    public SysUserDto convert(SysUser source) throws ConversionException {
        final SysUserDto target = new SysUserDto();
        this.populate(source, target);
        return target;
    }

    @Override
    public void populate(SysUser source, SysUserDto target) {
        if (StringUtils.isNotBlank(source.getId())) {
            target.setId(source.getId());
        }
        if (StringUtils.isNotBlank(source.getUserName())) {
            target.setUserName(source.getUserName());
        }
        if (StringUtils.isNotBlank(source.getEmail())) {
            target.setEmail(source.getEmail());
        }
        if (StringUtils.isNotBlank(source.getNickName())) {
            target.setNickName(source.getNickName());
        }
        if (StringUtils.isNotBlank(source.getLoginIp())) {
            target.setLoginIp(source.getLoginIp());
        }
        if (null != source.getLastLoginTime()) {
            target.setLastLoginTime(DateFormatUtils.format(source.getLastLoginTime(), DateUitls.Format.YYYY_MM_DD_HH_MM));
        }
        if (StringUtils.isNotBlank(source.getMobile())) {
            target.setMobile(source.getMobile());
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
