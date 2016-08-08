package com.imchuan.service.sys;

import com.imchuan.api.service.BaseService;
import com.imchuan.dto.sys.SysResourceDto;
import com.imchuan.entity.sys.SysResource;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-11 15:58
 */
public interface SysResourceService extends BaseService<SysResource, SysResourceDto, String> {
    /**
     * 根据url获取资源
     *
     * @param url
     * @return
     */
    SysResourceDto getResourceByUrl(final String url);
}
