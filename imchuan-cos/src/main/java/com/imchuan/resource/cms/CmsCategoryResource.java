
package com.imchuan.resource.cms;

import com.imchuan.api.front.AppResponse;
import com.imchuan.api.front.AppResult;
import com.imchuan.api.front.AppStatus;
import com.imchuan.api.pojo.Select2;
import com.imchuan.api.pojo.TreeNode;
import com.imchuan.api.resource.BaseResource;
import com.imchuan.api.service.BaseService;
import com.imchuan.dto.cms.CmsCategoryDto;
import com.imchuan.entity.cms.CmsCategory;
import com.imchuan.service.cms.CmsCategoryService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.List;

/**
 * 栏目管理
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-13 16:52
 */
@Controller
@RequestMapping("/cms/category")
public class CmsCategoryResource extends BaseResource<CmsCategory, CmsCategoryDto> {
    @Resource
    private CmsCategoryService cmsCategoryService;

    @Override
    protected BaseService<CmsCategory, CmsCategoryDto, String> getBaseService() {
        return cmsCategoryService;
    }

    @Override
    protected String getPrefix() {
        return "cms/category";
    }

    /**
     * 获取树
     *
     * @return
     */
    @RequestMapping(value = "/tree")
    @ResponseBody
    public TreeNode getTree() {
        return cmsCategoryService.getTree();
    }

    /**
     * 保存栏目
     *
     * @param cmsCategoryDto
     * @return
     */
    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public AppResult save(@RequestBody final CmsCategoryDto cmsCategoryDto) {
        if (StringUtils.isAnyBlank(cmsCategoryDto.getName(), cmsCategoryDto.getCode())) {
            return AppResponse.error(AppStatus.ERR_PARAMS, "栏目名称或编码不能为空");
        }
        final CmsCategoryDto categoryDto = cmsCategoryService.saveOrUpdate(cmsCategoryDto);
        return AppResponse.success(categoryDto);
    }

    /**
     * 获取全部分类
     *
     * @return
     */
    @RequestMapping(value = "/select2")
    @ResponseBody
    public List<Select2> getCategory() {
        return cmsCategoryService.getSelect2Data(cmsCategoryService.getRootCategory().getId());
    }

}
