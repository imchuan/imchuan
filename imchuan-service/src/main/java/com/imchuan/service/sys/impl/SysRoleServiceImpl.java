package com.imchuan.service.sys.impl;

import com.imchuan.api.pojo.GridExample;
import com.imchuan.api.pojo.Pagination;
import com.imchuan.api.pojo.TreeNode;
import com.imchuan.api.service.impl.BaseServiceImpl;
import com.imchuan.conversion.sys.SysRoleToDtoConverter;
import com.imchuan.conversion.sys.SysRoleToModelConverter;
import com.imchuan.conversion.sys.SysRoleToTreeConverter;
import com.imchuan.domian.sys.SysRoleDomain;
import com.imchuan.dto.sys.SysRoleDto;
import com.imchuan.entity.sys.SysMenu;
import com.imchuan.entity.sys.SysRole;
import com.imchuan.service.sys.SysMenuService;
import com.imchuan.service.sys.SysRoleService;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * 角色
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-11 14:24
 */
@Transactional
@Service("sysRoleService")
public class SysRoleServiceImpl extends BaseServiceImpl<SysRole, SysRoleDto, String> implements SysRoleService {
    @Resource
    private SysRoleToDtoConverter sysRoleToDtoConverter;
    @Resource
    private SysRoleToModelConverter sysRoleToModelConverter;
    @Resource
    private SysRoleToTreeConverter sysRoleToTreeConverter;
    @Resource
    private SysMenuService sysMenuService;

    @Override
    @PostConstruct
    public void initConverter() {
        super.setConverter(sysRoleToModelConverter, sysRoleToDtoConverter);
    }

    @Override
    public SysRoleDto saveSysRole(final SysRoleDto sysRole) {
        return super.saveOrUpdate(sysRole);
    }

    @Override
    public boolean existsCode(final String code) {
        final SysRoleDto sysRoleDto = super.findOneByProperty(SysRoleDomain.CODE, code);
        if (null != sysRoleDto) {
            return true;
        }
        return false;
    }

    @Override
    public boolean existsCode(final String code, final String id) {
        final Criteria criteria = super.createCriteria();

        criteria.add(Restrictions.eq(SysRoleDomain.CODE, code))
                .add(Restrictions.ne(SysRoleDomain.ID, id));
        final SysRole sysRole = (SysRole) criteria.uniqueResult();
        if (null != sysRole) {
            return true;
        }
        return false;
    }

    @Override
    public Pagination<SysRoleDto> getListByCondition(SysRoleDto sysUser, GridExample gridExample) {
        return super.findPageByExample(gridExample, null);
    }

    /**
     * 获取角色树
     *
     * @return
     */
    @Override
    public List<TreeNode> getRoleTree() {
        final List<SysRole> sysRoles = super.getBaseDao().findAll(SysRole.class);
        return sysRoleToTreeConverter.convertAll(sysRoles);
    }

    /**
     * 根据角色id查找角色信息
     *
     * @param ids
     * @return
     */
    @Override
    public List<SysRole> getByIds(final List<String> ids) {
        return super.getBaseDao().find(SysRole.class, Restrictions.in(SysRoleDomain.ID, ids));
    }

    /**
     * 根据角色获取属性菜单数据
     *
     * @param roleId
     * @return
     */
    @Override
    public TreeNode getRoleMenus(final String roleId) {
        if (StringUtils.isNotBlank(roleId)) {
            final SysRole sysRole = super.getBaseDao().get(SysRole.class, roleId);
            final Set<SysMenu> sysMenus = sysRole.getMenus();
            final TreeNode treeNode = sysMenuService.getMenuTree();
            setTreeCheck(treeNode, sysMenus);
            return treeNode;
        } else {
            return sysMenuService.getMenuTree();
        }
    }

    /**
     * 保存角色菜单
     *
     * @param roleId
     * @param menuIds
     */
    @Override
    public void saveRoleMenu(final String roleId, final List<String> menuIds) {
        final SysRole sysRole = super.getBaseDao().get(SysRole.class, roleId);
        final List<SysMenu> sysMenus = sysMenuService.getByIds(menuIds);
        sysRole.setMenus(new HashSet<>(sysMenus));
        super.getBaseDao().update(sysRole);
    }

    /**
     * 根据角色菜单设置是否选中
     *
     * @param treeNode
     * @param sysMenus
     */
    private void setTreeCheck(TreeNode treeNode, Set<SysMenu> sysMenus) {
        final List<TreeNode> childrens = treeNode.getChildren();
        for (final TreeNode node : childrens) {
            sysMenus.stream().filter(sysMenu -> sysMenu.getId().equals(node.getId())).forEach(sysMenu -> node.setChecked(true));
            setTreeCheck(node, sysMenus);
        }
    }
}
