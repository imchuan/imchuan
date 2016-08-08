package com.imchuan.service.sys.impl;

import com.imchuan.api.pojo.TreeNode;
import com.imchuan.api.service.impl.BaseServiceImpl;
import com.imchuan.conversion.sys.SysMenuToDtoConverter;
import com.imchuan.conversion.sys.SysMenuToModelConverter;
import com.imchuan.conversion.sys.SysMenuToTreeConverter;
import com.imchuan.domian.sys.SysMenuDomain;
import com.imchuan.dto.sys.SysMenuDto;
import com.imchuan.entity.sys.SysMenu;
import com.imchuan.service.sys.SysMenuService;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-21 16:06
 */
@Transactional
@Service("sysMenuService")
public class SysMenuServiceImpl extends BaseServiceImpl<SysMenu, SysMenuDto, String> implements SysMenuService {
    @Resource
    private SysMenuToDtoConverter sysMenuToDtoConverter;
    @Resource
    private SysMenuToModelConverter sysMenuToModelConverter;
    @Resource
    private SysMenuToTreeConverter sysMenuToTreeConverter;

    @Override
    @PostConstruct
    public void initConverter() {
        super.setConverter(sysMenuToModelConverter, sysMenuToDtoConverter);
    }

    @Override
    public List<SysMenu> getByIds(List<String> ids) {
        return super.getBaseDao().find(SysMenu.class, Restrictions.in(SysMenuDomain.ID, ids));
    }

    /**
     * 获取系统菜单根路径
     *
     * @return
     */
    @Override
    public SysMenu getRootMenu() {
        return super.getBaseDao().findOne(SysMenu.class, Restrictions.isNull(SysMenuDomain.PARENT_ID));
    }

    /**
     * 获取树形菜单数据
     *
     * @return
     */
    @Override
    public TreeNode getMenuTree() {
        final SysMenu sysMenu = getRootMenu();
        if (Objects.nonNull(sysMenu)) {
            return buildMenuTree(sysMenu.getId());
        }
        return null;
    }

    /**
     * 构建菜单树
     *
     * @param pid 父菜单id
     * @return
     */
    @Override
    public TreeNode buildMenuTree(String pid) {
        final SysMenu sysMenu = super.getBaseDao().get(SysMenu.class, pid);
        TreeNode node = sysMenuToTreeConverter.convert(sysMenu);
        List<TreeNode> childrens = getChildrens(pid);
        if (childrens.size() > 0) {
            node.setIsParent(true);
            node.setOpen(true);
        }
        for (TreeNode child : childrens) {
            TreeNode n = buildMenuTree(child.getId());
            node.getChildren().add(n);
        }
        return node;
    }

    /**
     * 根据指定菜单集，构建菜单树
     *
     * @param pid
     * @param sysMenus
     * @return
     */
    @Override
    public TreeNode buildMenuTree(final String pid, final List<SysMenu> sysMenus) {

        SysMenu currentMenu = sysMenus.stream().filter(sysMenu -> sysMenu.getId().equals(pid)).findFirst().get();

        TreeNode node = sysMenuToTreeConverter.convert(currentMenu);

        List<SysMenu> sysMenusList = sysMenus.stream().filter(sysMenu -> StringUtils.isNotBlank(sysMenu.getParentId()) && sysMenu.getParentId().equals(pid)).collect(Collectors.toList());

        List<TreeNode> childrens = sysMenuToTreeConverter.convertAll(sysMenusList);

        if (childrens.size() > 0) {
            node.setIsParent(true);
            node.setOpen(true);
        }
        for (TreeNode child : childrens) {
            TreeNode n = buildMenuTree(child.getId(), sysMenus);
            node.getChildren().add(n);
        }
        return node;
    }

    /**
     * 获取子菜单列表
     *
     * @param pid 父菜单id
     * @return
     */
    @Override
    public List<TreeNode> getChildrens(final String pid) {
        List<SysMenu> list;
        if (StringUtils.isNotBlank(pid)) {
            list = super.getBaseDao().findByProperty(SysMenu.class, SysMenuDomain.PARENT_ID, pid);
        } else {
            list = super.getBaseDao().find(SysMenu.class, Restrictions.isNull(SysMenuDomain.PARENT_ID));
        }
        return sysMenuToTreeConverter.convertAll(list);
    }
}
