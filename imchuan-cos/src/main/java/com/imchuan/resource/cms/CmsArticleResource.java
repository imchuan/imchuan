
package com.imchuan.resource.cms;

import com.imchuan.api.front.AppResponse;
import com.imchuan.api.front.AppResult;
import com.imchuan.api.front.AppStatus;
import com.imchuan.api.pojo.GridExample;
import com.imchuan.api.pojo.Pagination;
import com.imchuan.api.resource.BaseResource;
import com.imchuan.api.service.BaseService;
import com.imchuan.dto.cms.CmsArticleDto;
import com.imchuan.entity.cms.CmsArticle;
import com.imchuan.service.cms.CmsArticleService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.List;
import java.util.Objects;

/**
 * 文章管理
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-13 16:52
 */
@Controller
@RequestMapping("/cms/article")
public class CmsArticleResource extends BaseResource<CmsArticle, CmsArticleDto> {
    @Resource
    private CmsArticleService cmsArticleService;

    @Override
    protected BaseService<CmsArticle, CmsArticleDto, String> getBaseService() {
        return cmsArticleService;
    }

    @Override
    protected String getPrefix() {
        return "cms/article";
    }

    /**
     * 条件查询
     *
     * @param condition
     * @param gridExample
     * @return
     */
    @RequestMapping(value = "/search")
    @ResponseBody
    public Pagination getList(final CmsArticleDto condition, final GridExample gridExample) {
        return cmsArticleService.getList(condition, gridExample);
    }

    /**
     * 保存文章
     *
     * @param cmsArticleDto
     * @return
     */
    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public AppResult save(@RequestBody final CmsArticleDto cmsArticleDto) {
        AppResult appResult = cmsArticleService.validate(cmsArticleDto);
        if (Objects.nonNull(appResult)) {
            return appResult;
        }
        CmsArticleDto articleDto;
        if (StringUtils.isNotBlank(cmsArticleDto.getId())) {
            articleDto = cmsArticleService.updateArticle(cmsArticleDto);
        } else {
            articleDto = cmsArticleService.saveArticle(cmsArticleDto);
        }
        return AppResponse.success(articleDto);
    }

    /**
     * 置顶
     *
     * @param ids 文章id列表
     * @return 消息对象
     */
    @RequestMapping(value = "/toTop", method = RequestMethod.POST)
    @ResponseBody
    public AppResult toTop(@RequestBody final List<String> ids) {
        if (ids.isEmpty()) {
            return AppResponse.error(AppStatus.ERR_PARAMS);
        }
        cmsArticleService.toTop(ids);
        return AppResponse.success();
    }

    /**
     * 上架
     *
     * @param ids 文章id列表
     * @return 消息对象
     */
    @RequestMapping(value = "/putAway", method = RequestMethod.POST)
    @ResponseBody
    public AppResult putAway(@RequestBody final List<String> ids) {
        if (ids.isEmpty()) {
            return AppResponse.error(AppStatus.ERR_PARAMS);
        }
        cmsArticleService.putAway(ids);
        return AppResponse.success();
    }

    /**
     * 下架
     *
     * @param ids 文章id列表
     * @return 消息对象
     */
    @RequestMapping(value = "/soldOut", method = RequestMethod.POST)
    @ResponseBody
    public AppResult soldOut(@RequestBody final List<String> ids) {
        if (ids.isEmpty()) {
            return AppResponse.error(AppStatus.ERR_PARAMS);
        }
        cmsArticleService.soldOut(ids);
        return AppResponse.success();
    }
}
