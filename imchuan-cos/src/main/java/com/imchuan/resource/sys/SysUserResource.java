package com.imchuan.resource.sys;

import com.imchuan.api.front.AppResponse;
import com.imchuan.api.front.AppResult;
import com.imchuan.api.front.AppStatus;
import com.imchuan.api.pojo.GridExample;
import com.imchuan.api.pojo.Pagination;
import com.imchuan.api.pojo.TreeNode;
import com.imchuan.api.resource.BaseResource;
import com.imchuan.api.service.BaseService;
import com.imchuan.dto.sys.SysUserDto;
import com.imchuan.entity.sys.SysUser;
import com.imchuan.service.sys.SysUserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * 系统用户管理
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-13 16:52
 */
@Controller
@RequestMapping("/sys/user")
public class SysUserResource extends BaseResource<SysUser, SysUserDto> {
    @Resource
    private SysUserService sysUserService;

    @Override
    protected BaseService<SysUser, SysUserDto, String> getBaseService() {
        return sysUserService;
    }

    @Override
    protected String getPrefix() {
        return "sys/sysUser";
    }

    /**
     * 保存
     *
     * @param sysUser
     * @return
     */
    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public AppResult save(@RequestBody final SysUserDto sysUser) {
        boolean isExist;
        if (StringUtils.isNotBlank(sysUser.getId())) {
            isExist = sysUserService.existUserName(sysUser.getUserName(), sysUser.getId());
        } else {
            isExist = sysUserService.existUserName(sysUser.getUserName());
        }
        if (isExist) {
            AppResponse.error(AppStatus.ERR_BUSINESS, "用户名已存在");
        }
        final SysUserDto result = sysUserService.saveSysUser(sysUser);
        return AppResponse.success(result);
    }

    @RequestMapping(value = "/search")
    @ResponseBody
    public Pagination search(final SysUserDto sysUser, final GridExample gridExample) {
        return sysUserService.getListByCondition(sysUser, gridExample);
    }

    /**
     * 跳转用户角色
     *
     * @return
     */
    @RequestMapping(value = "/userRoleIndex")
    public String goUserRole(final String uid, final Model model) {
        model.addAttribute("uid", uid);
        return "sys/userRole";
    }

    /**
     * 获取用户角色
     *
     * @return
     */
    @RequestMapping(value = "/getUserRole/{uid}")
    @ResponseBody
    public List<TreeNode> getUserRole(@PathVariable("uid") final String uid) {
        return sysUserService.getUserRoleTree(uid);
    }

    /**
     * 保存用户角色
     *
     * @return
     */
    @RequestMapping(value = "/saveUserRole/{uid}", method = RequestMethod.POST)
    @ResponseBody
    public AppResult saveUserRole(@PathVariable("uid") final String uid,
                                  @RequestBody final List<String> roleIds) {
        sysUserService.saveUserRole(uid, roleIds);
        return AppResponse.success();
    }


}
