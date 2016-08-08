package com.imchuan.service.sys;

import com.imchuan.api.pojo.GridExample;
import com.imchuan.api.pojo.Pagination;
import com.imchuan.api.pojo.TreeNode;
import com.imchuan.api.service.BaseService;
import com.imchuan.dto.sys.SysRoleDto;
import com.imchuan.entity.sys.SysRole;

import java.util.List;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-10 20:34
 */
public interface SysRoleService extends BaseService<SysRole, SysRoleDto, String> {

    SysRoleDto saveSysRole(SysRoleDto sysRole);

    boolean existsCode(final String code);

    boolean existsCode(final String code, final String id);

    Pagination<SysRoleDto> getListByCondition(final SysRoleDto sysUser, final GridExample gridExample);

    /**
     * 获取角色树
     *
     * @return
     */
    List<TreeNode> getRoleTree();

    /**
     * 根据角色id查找角色信息
     *
     * @param ids
     * @return
     */
    List<SysRole> getByIds(final List<String> ids);

    /**
     * 获取角色菜单
     *
     * @param roleId
     * @return
     */
    TreeNode getRoleMenus(final String roleId);

    /**
     * 保存角色菜单
     *
     * @param roleId
     * @param menuIds
     */
    void saveRoleMenu(final String roleId, final List<String> menuIds);
}
