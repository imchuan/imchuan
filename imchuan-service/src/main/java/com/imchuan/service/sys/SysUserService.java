package com.imchuan.service.sys;

import com.imchuan.api.pojo.GridExample;
import com.imchuan.api.pojo.Pagination;
import com.imchuan.api.pojo.TreeNode;
import com.imchuan.api.service.BaseService;
import com.imchuan.dto.sys.SysUserDto;
import com.imchuan.entity.sys.SysMenu;
import com.imchuan.entity.sys.SysUser;

import java.util.List;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-10 20:34
 */
public interface SysUserService extends BaseService<SysUser, SysUserDto, String> {
    /**
     * 保存用户信息
     *
     * @param sysUser
     */
    SysUserDto saveSysUser(final SysUserDto sysUser);

    /**
     * 根据条件查询
     *
     * @param condition
     * @param gridExample
     * @return
     */
    Pagination<SysUserDto> getListByCondition(final SysUserDto condition, final GridExample gridExample);

    /**
     * 用户名是否存在
     *
     * @param userName 用户名
     * @return
     */
    boolean existUserName(final String userName);

    /**
     * 判断用户名是否存在（更新）
     *
     * @param userName 用户名
     * @param id       用户id
     * @return
     */
    boolean existUserName(final String userName, final String id);

    /**
     * 根据用户名和密码查找
     *
     * @param userName 用户名
     * @param password 密码
     * @return
     */
    SysUserDto getByUserNameAndPassword(final String userName, final String password);

    /**
     * 根据用户名查找用户
     *
     * @param userName 用户名
     * @return
     */
    SysUserDto getByUserName(final String userName);

    /**
     * 获取用户角色树
     *
     * @param id
     * @return
     */
    List<TreeNode> getUserRoleTree(final String id);

    /**
     * 保存用户角色信息
     *
     * @param uid
     * @param roleIds
     */
    void saveUserRole(final String uid, final List<String> roleIds);

    /**
     * 获取用户可访问的菜单集合
     *
     * @param uid
     * @return
     */
    List<SysMenu> getUserMenu(final String uid);

    TreeNode getUserMenuTree(final String uid);
}