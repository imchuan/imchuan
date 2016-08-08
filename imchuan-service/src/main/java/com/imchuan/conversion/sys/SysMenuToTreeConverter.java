package com.imchuan.conversion.sys;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.api.pojo.TreeNode;
import com.imchuan.entity.sys.SysMenu;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component("sysMenuToTreeConverter")
public class SysMenuToTreeConverter extends AbstractConverter<SysMenu, TreeNode> {

    @Override
    public TreeNode convert(SysMenu source) throws ConversionException {
        final TreeNode target = new TreeNode();
        populate(source, target);
        return target;
    }

    @Override
    public void populate(SysMenu source, TreeNode target) {
        if (Objects.nonNull(source.getId())) {
            target.setId(source.getId());
        }
        if (StringUtils.isNotBlank(source.getName())) {
            target.setName(source.getName());
        }
        if (StringUtils.isNotBlank(source.getUrl())) {
            target.setLink(source.getUrl());
        }
        if (Objects.nonNull(source.getQueue())) {
            target.setQueue(source.getQueue());
        } else {
            target.setQueue(0);
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
