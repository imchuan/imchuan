package com.imchuan.resource.sys;

import com.imchuan.api.front.AppResponse;
import com.imchuan.api.front.AppResult;
import com.imchuan.api.front.AppStatus;
import com.imchuan.api.pojo.GridExample;
import com.imchuan.api.pojo.Pagination;
import com.imchuan.api.pojo.TreeNode;
import com.imchuan.api.resource.BaseResource;
import com.imchuan.api.service.BaseService;
import com.imchuan.dto.sys.SysRoleDto;
import com.imchuan.entity.sys.SysRole;
import com.imchuan.service.sys.SysRoleService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * 系统角色管理
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-13 16:52
 */
@Controller
@RequestMapping("/sys/role")
public class SysRoleResource extends BaseResource<SysRole, SysRoleDto> {
    @Resource
    private SysRoleService sysRoleService;

    @Override
    protected BaseService<SysRole, SysRoleDto, String> getBaseService() {
        return sysRoleService;
    }

    @Override
    protected String getPrefix() {
        return "sys/sysRole";
    }

    /**
     * 保存
     *
     * @param sysRoleDto
     * @return
     */
    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public AppResult save(@RequestBody final SysRoleDto sysRoleDto) {
        boolean isExist;
        if (StringUtils.isNotBlank(sysRoleDto.getId())) {
            isExist = sysRoleService.existsCode(sysRoleDto.getCode(), sysRoleDto.getId());
        } else {
            isExist = sysRoleService.existsCode(sysRoleDto.getCode());
        }
        if (isExist) {
            AppResponse.error(AppStatus.ERR_BUSINESS, "角色编码已存在");
        }
        final SysRoleDto result = sysRoleService.saveSysRole(sysRoleDto);
        return AppResponse.success(result);
    }

    @RequestMapping(value = "/search")
    @ResponseBody
    public Pagination search(final SysRoleDto sysRoleDto, final GridExample gridExample) {
        return sysRoleService.getListByCondition(sysRoleDto, gridExample);
    }

    /**
     * 获取角色树
     *
     * @return
     */
    @RequestMapping(value = "/tree")
    @ResponseBody
    public List<TreeNode> getRoleTree() {
        return sysRoleService.getRoleTree();
    }

    /**
     * 根据角色查找所属菜单
     *
     * @return
     */
    @RequestMapping(value = "/roleMenus")
    @ResponseBody
    public TreeNode getMenuTreeByRoleId(@RequestParam(required = false) final String roleId) {
        return sysRoleService.getRoleMenus(roleId);
    }

    /**
     * 保存角色菜单
     *
     * @return
     */
    @RequestMapping(value = "/saveRoleMenu/{roleId}", method = RequestMethod.POST)
    @ResponseBody
    public AppResult saveMenuRole(@PathVariable("roleId") final String roleId,
                                  @RequestBody final List<String> menuIds) {
        sysRoleService.saveRoleMenu(roleId, menuIds);
        return AppResponse.success();
    }

    /**
     * 跳转到菜单权限页面
     *
     * @return
     */
    @RequestMapping(value = "/roleMenuIndex")
    public String pageMenuRole() {
        return "sys/menuRole";
    }

}
