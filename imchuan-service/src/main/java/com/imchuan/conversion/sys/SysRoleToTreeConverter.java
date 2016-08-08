package com.imchuan.conversion.sys;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.api.pojo.TreeNode;
import com.imchuan.entity.sys.SysRole;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.util.Objects;


@Component("sysRoleToTreeConverter")
public class SysRoleToTreeConverter extends AbstractConverter<SysRole, TreeNode> {

    @Override
    public TreeNode convert(SysRole source) throws ConversionException {
        final TreeNode target = new TreeNode();
        populate(source, target);
        return target;
    }

    @Override
    public void populate(SysRole source, TreeNode target) {
        if (Objects.nonNull(source.getId())) {
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
    }
}
