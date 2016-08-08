package com.imchuan.conversion.cms;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.exceptions.ConversionException;
import com.imchuan.api.pojo.TreeNode;
import com.imchuan.entity.cms.CmsCategory;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.util.Objects;


@Component("cmsCategoryToTreeConverter")
public class CmsCategoryToTreeConverter extends AbstractConverter<CmsCategory, TreeNode> {

    @Override
    public TreeNode convert(CmsCategory source) throws ConversionException {
        final TreeNode target = new TreeNode();
        populate(source, target);
        return target;
    }

    @Override
    public void populate(CmsCategory source, TreeNode target) {
        if (StringUtils.isNotBlank(source.getId())) {
            target.setId(source.getId());
        }
        if (StringUtils.isNotBlank(source.getCode())) {
            target.setCode(source.getCode());
        }
        if (StringUtils.isNotBlank(source.getName())) {
            target.setName(source.getName());
        }
        if (StringUtils.isNotBlank(source.getUrl())) {
            target.setLink(source.getUrl());
        }
        if (Objects.nonNull(source.getQueue())) {
            target.setQueue(source.getQueue());
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
