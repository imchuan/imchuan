package com.imchuan.service.cms;

import com.imchuan.api.pojo.Select2;
import com.imchuan.api.service.BaseService;
import com.imchuan.dto.cms.CmsTagsDto;
import com.imchuan.entity.cms.CmsTags;

import java.util.List;

/**
 * 标签
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-10 20:34
 */
public interface CmsTagsService extends BaseService<CmsTags, CmsTagsDto, String> {
    /**
     * 获取所有标签
     *
     * @return
     */
    List<Select2> getSelect2Data();

    /**
     * 保存
     *
     * @param tagName
     */
    void saveTags(final List<String> tagName);
}