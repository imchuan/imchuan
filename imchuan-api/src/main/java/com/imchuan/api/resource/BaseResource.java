package com.imchuan.api.resource;

import com.imchuan.api.constants.ModelKeys;
import com.imchuan.api.front.AppResponse;
import com.imchuan.api.front.AppResult;
import com.imchuan.api.pojo.AbstractEntity;
import com.imchuan.api.pojo.BaseDto;
import com.imchuan.api.service.BaseService;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-21 09:54
 */
public abstract class BaseResource<M extends AbstractEntity, Dto extends BaseDto> {
    private static final String PAGE_EDIT_POSTFIX = "Edit";
    private static final String PAGE_LIST_POSTFIX = "List";

    protected abstract BaseService<M, Dto, String> getBaseService();

    protected abstract String getPrefix();

    protected final String PAGE_EDIT = getPrefix() + PAGE_EDIT_POSTFIX;
    protected final String PAGE_LIST = getPrefix() + PAGE_LIST_POSTFIX;

    /**
     * 跳转到列表页
     *
     * @return
     */
    @RequestMapping(value = "/list")
    public String list() {
        return PAGE_LIST;
    }

    /**
     * 跳转到新增页面
     *
     * @return
     */
    @RequestMapping(value = "/edit")
    public String add() {
        return PAGE_EDIT;
    }

    /**
     * 跳转到编辑页面
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/edit/{id}")
    public String edit(@PathVariable("id") final String id, final Model model) {
        final Dto sysUser = getBaseService().get(id);
        model.addAttribute(ModelKeys.ENTITY, sysUser);
        return PAGE_EDIT;
    }

    /**
     * 批量删除
     *
     * @param ids
     * @return
     */
    @RequestMapping(value = "/batchDelete", method = RequestMethod.POST)
    @ResponseBody
    public AppResult batchDelete(@RequestBody final List<String> ids) {
        getBaseService().remove(ids);
        return AppResponse.success();
    }

    /**
     * 删除
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public AppResult delete(@RequestBody final String id) {
        getBaseService().remove(id);
        return AppResponse.success();
    }
}
