package com.imchuan.service.sys.impl;

import com.imchuan.api.service.impl.BaseServiceImpl;
import com.imchuan.conversion.sys.SysResourceToDtoConverter;
import com.imchuan.conversion.sys.SysResourceToModelConverter;
import com.imchuan.dto.sys.SysResourceDto;
import com.imchuan.entity.sys.SysResource;
import com.imchuan.service.sys.SysResourceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

/**
 * 资源
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-13 16:05
 */
@Transactional
@Service("sysResourceService")
public class SysResourceServiceImpl extends BaseServiceImpl<SysResource, SysResourceDto, String> implements SysResourceService {
    @Resource
    private SysResourceToDtoConverter sysResourceToDtoConverter;
    @Resource
    private SysResourceToModelConverter sysResourceToModelConverter;

    @Override
    @PostConstruct
    public void initConverter() {
        super.setConverter(sysResourceToModelConverter, sysResourceToDtoConverter);
    }

    /**
     * 根据url获取资源
     *
     * @param url
     * @return
     */
    @Override
    public SysResourceDto getResourceByUrl(String url) {
        return null;
    }


}
