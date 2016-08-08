package com.imchuan.resource.sys;

import com.imchuan.api.front.AppResponse;
import com.imchuan.api.front.AppResult;
import com.imchuan.api.front.AppStatus;
import com.imchuan.api.pojo.TreeNode;
import com.imchuan.api.resource.BaseResource;
import com.imchuan.api.service.BaseService;
import com.imchuan.dto.sys.SysMenuDto;
import com.imchuan.entity.sys.SysMenu;
import com.imchuan.service.sys.SysMenuService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

/**
 * 系统菜单管理
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-13 16:52
 */
@Controller
@RequestMapping("/sys/menu")
public class SysMenuResource extends BaseResource<SysMenu, SysMenuDto> {
    @Resource
    private SysMenuService sysMenuService;

    @Override
    protected BaseService<SysMenu, SysMenuDto, String> getBaseService() {
        return sysMenuService;
    }

    @Override
    protected String getPrefix() {
        return "sys/sysMenu";
    }

    /**
     * 获取菜单树
     *
     * @return
     */
    @RequestMapping(value = "/tree", method = RequestMethod.GET)
    @ResponseBody
    public TreeNode getTreeList() {
        return sysMenuService.getMenuTree();
    }

    /**
     * 保存
     *
     * @param sysMenuDto
     * @return
     */
    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public AppResult save(@RequestBody final SysMenuDto sysMenuDto) {
        if (StringUtils.isAnyBlank(sysMenuDto.getName())) {
            return AppResponse.error(AppStatus.ERR_PARAMS, "菜单名称不能为空");
        }
        final SysMenuDto sysMenuDto1 = sysMenuService.saveOrUpdate(sysMenuDto);
        return AppResponse.success(sysMenuDto1);
    }

    /**
     * 添加菜单类别
     *
     * @param sysMenuDto
     * @return
     */
    @RequestMapping(value = "/saveRoot", method = RequestMethod.POST)
    @ResponseBody
    public AppResult saveRoot(@RequestBody final SysMenuDto sysMenuDto) {
        if (StringUtils.isAnyBlank(sysMenuDto.getName())) {
            return AppResponse.error(AppStatus.ERR_PARAMS, "菜单名称或菜单地址不能为空");
        }
        final SysMenuDto sysMenuDto1 = sysMenuService.saveOrUpdate(sysMenuDto);
        return AppResponse.success(sysMenuDto1);
    }

    /**
     * 删除菜单
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public AppResult delete(@RequestBody final String id) {
        if (StringUtils.isAnyBlank(id)) {
            return AppResponse.error(AppStatus.ERR_PARAMS, "菜单不存在");
        }
        sysMenuService.remove(id);
        return AppResponse.success();
    }

}
