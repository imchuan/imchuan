
package com.imchuan.resource.cms;

import com.imchuan.api.pojo.Select2;
import com.imchuan.api.resource.BaseResource;
import com.imchuan.api.service.BaseService;
import com.imchuan.dto.cms.CmsTagsDto;
import com.imchuan.entity.cms.CmsTags;
import com.imchuan.service.cms.CmsTagsService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.List;

/**
 * 标签
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-13 16:52
 */
@Controller
@RequestMapping("/cms/tags")
public class CmsTagsResource extends BaseResource<CmsTags, CmsTagsDto> {
    @Resource
    private CmsTagsService cmsTagsService;

    @Override
    protected BaseService<CmsTags, CmsTagsDto, String> getBaseService() {
        return cmsTagsService;
    }

    @Override
    protected String getPrefix() {
        return "cms/tags";
    }

    /**
     * 获取下拉框数据
     *
     * @return
     */
    @RequestMapping(value = "/select2")
    @ResponseBody
    public List<Select2> getSelect2Data() {
        return cmsTagsService.getSelect2Data();
    }

}
