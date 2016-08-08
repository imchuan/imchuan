package com.imchuan.security;

import com.imchuan.dto.sys.SysResourceDto;
import com.imchuan.dto.sys.SysRoleDto;
import com.imchuan.service.sys.SysResourceService;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Set;

/**
 * @author liuqq
 * @date 2015-10-19
 */
public class CustomSecurityMetadataSource implements FilterInvocationSecurityMetadataSource {

    private SysResourceService sysResourceService;

    public void setSysResourceService(SysResourceService sysResourceService) {
        this.sysResourceService = sysResourceService;
    }

    @Override
    public Collection<ConfigAttribute> getAttributes(Object object) throws IllegalArgumentException {
        final String requestUrl = ((FilterInvocation) object).getRequestUrl();
        final SysResourceDto sysResource = sysResourceService.getResourceByUrl(requestUrl);
        if (null != sysResource) {
            final Set<SysRoleDto> sysRoles = sysResource.getRoles();

            Collection<ConfigAttribute> configAttributes = new ArrayList<>();

            for (final SysRoleDto sysRole : sysRoles) {
                ConfigAttribute configAttribute = new SecurityConfig(sysRole.getCode());
                configAttributes.add(configAttribute);
            }
            return configAttributes;
        }
        return null;
    }

    @Override
    public Collection<ConfigAttribute> getAllConfigAttributes() {
        return null;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return true;
    }
}
