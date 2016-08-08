package com.imchuan.conversion.sys;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.dto.sys.SysUserDto;
import com.imchuan.entity.sys.SysUser;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.text.ParseException;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-19 17:27
 */
@Component("sysUserToModelConverter")
public class SysUserToModelConverter extends AbstractConverter<SysUserDto, SysUser> {
    public static final Logger LOGGER = LoggerFactory.getLogger(SysUserToModelConverter.class);

    @Override
    public SysUser convert(SysUserDto source) throws ConversionException {
        final SysUser target = super.getTarget();
        this.populate(source, target);
        return target;
    }

    @Override
    public void populate(SysUserDto source, SysUser target) {
        if (StringUtils.isNotBlank(source.getUserName())) {
            target.setUserName(source.getUserName());
        }
        if (StringUtils.isNotBlank(source.getEmail())) {
            target.setEmail(source.getEmail());
        }
        if (StringUtils.isNotBlank(source.getPassword())) {
            target.setPassword(source.getPassword());
        }
        if (StringUtils.isNotBlank(source.getNickName())) {
            target.setNickName(source.getNickName());
        }
        if (StringUtils.isNotBlank(source.getStatus())) {
            target.setStatus(source.getStatus());
        }
        if (StringUtils.isNotBlank(source.getLoginIp())) {
            target.setLoginIp(source.getLoginIp());
        }
        if (StringUtils.isNotBlank(source.getLastLoginTime())) {
            try {
                target.setLastLoginTime(DateUtils.parseDate(source.getLastLoginTime(), "yyyy-MM-dd HH:mm:ss"));
            } catch (ParseException e) {
                LOGGER.error("<Converter 转换错误> : " + e.getMessage());
            }
        }
        if (StringUtils.isNotBlank(source.getMobile())) {
            target.setMobile(source.getMobile());
        }
        if (StringUtils.isNotBlank(source.getRemark())) {
            target.setRemark(source.getRemark());
        }
    }
}
