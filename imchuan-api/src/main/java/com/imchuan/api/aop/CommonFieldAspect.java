package com.imchuan.api.aop;

import com.imchuan.api.pojo.BaseDto;
import com.imchuan.api.util.DateUitls;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.aspectj.lang.JoinPoint;

import java.util.Date;

/**
 * 保存前给公共字段赋值
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-13 18:11
 */
public class CommonFieldAspect {

    /**
     * 保存前执行
     *
     * @param joinPoint
     */
    public void beforeSave(JoinPoint joinPoint) {
        Object object = joinPoint.getArgs()[0];
        if (object instanceof BaseDto) {
            BaseDto entity = (BaseDto) object;
            String nowDateStr = DateFormatUtils.format(new Date(), DateUitls.Format.YYYY_MM_DD_HH_MM_SS);
            if (StringUtils.isBlank(entity.getId())) {
                entity.setCreatedTime(nowDateStr);
            }
            entity.setModifiedTime(nowDateStr);
        }
    }
}
