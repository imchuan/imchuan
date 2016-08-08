package com.imchuan.service.sys;

import com.imchuan.api.pojo.TreeNode;
import com.imchuan.api.service.BaseService;
import com.imchuan.dto.sys.SysMenuDto;
import com.imchuan.entity.sys.SysMenu;

import java.util.List;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-10 20:34
 */
public interface SysMenuService extends BaseService<SysMenu, SysMenuDto, String> {
    List<SysMenu> getByIds(final List<String> ids);
    /**
     * 获取系统菜单根路径
     *
     * @return
     */
    SysMenu getRootMenu();

    /**
     * 获取树形菜单数据
     *
     * @return
     */
    TreeNode getMenuTree();

    /**
     * 构建菜单树
     *
     * @param pid 父菜单id
     * @return
     */
    TreeNode buildMenuTree(final String pid);

    /**
     * 根据指定菜单集，构建菜单树
     *
     * @param pid
     * @param sysMenus
     * @return
     */
    TreeNode buildMenuTree(final String pid, final List<SysMenu> sysMenus);

    /**
     * 获取子菜单列表
     *
     * @param pid 父菜单id
     * @return
     */
    List<TreeNode> getChildrens(final String pid);


}
