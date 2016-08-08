package com.imchuan.service.sys.impl;

import com.imchuan.api.pojo.GridExample;
import com.imchuan.api.pojo.Pagination;
import com.imchuan.api.pojo.TreeNode;
import com.imchuan.api.service.impl.BaseServiceImpl;
import com.imchuan.api.util.PasswordUtils;
import com.imchuan.conversion.sys.SysUserToDtoConverter;
import com.imchuan.conversion.sys.SysUserToModelConverter;
import com.imchuan.domian.sys.SysUserDomain;
import com.imchuan.dto.sys.SysUserDto;
import com.imchuan.entity.sys.AuthUser;
import com.imchuan.entity.sys.SysMenu;
import com.imchuan.entity.sys.SysRole;
import com.imchuan.entity.sys.SysUser;
import com.imchuan.enums.SysUserEnum;
import com.imchuan.service.sys.SysMenuService;
import com.imchuan.service.sys.SysRoleService;
import com.imchuan.service.sys.SysUserService;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.*;

/**
 * 后台管理用户
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-10 21:01
 */
@Transactional
@Service("sysUserService")
public class SysUserServiceImpl extends BaseServiceImpl<SysUser, SysUserDto, String> implements SysUserService, UserDetailsService {
    @Resource
    private SysUserToDtoConverter sysUserToDtoConverter;
    @Resource
    private SysUserToModelConverter sysUserToModelConverter;
    @Resource
    private SysRoleService sysRoleService;
    @Resource
    private SysMenuService sysMenuService;

    @Override
    @PostConstruct
    public void initConverter() {
        super.setConverter(sysUserToModelConverter, sysUserToDtoConverter);
    }

    /**
     * 保存用户信息
     *
     * @param sysUser
     */
    @Override
    public SysUserDto saveSysUser(final SysUserDto sysUser) {
        if (StringUtils.isBlank(sysUser.getId())) {
            sysUser.setPassword(PasswordUtils.encryptPassword(sysUser.getPassword()));
            sysUser.setStatus(SysUserEnum.Status.NORMAL.getCode());
        }
        return super.saveOrUpdate(sysUser);
    }


    /**
     * 根据条件查询
     *
     * @param condition
     * @param gridExample
     * @return
     */
    @Override
    public Pagination<SysUserDto> getListByCondition(final SysUserDto condition, final GridExample gridExample) {
        return super.findPageByExample(gridExample, null);
    }

    /**
     * 用户名是否存在
     *
     * @param userName 用户名
     * @return
     */
    @Override
    public boolean existUserName(final String userName) {
        final SysUserDto sysUser = getByUserName(userName);
        if (null != sysUser) {
            return true;
        }
        return false;
    }

    /**
     * 判断用户名是否存在（更新）
     *
     * @param userName 用户名
     * @param id       用户id
     * @return
     */
    @Override
    public boolean existUserName(final String userName, String id) {
        final Criteria criteria = super.createCriteria();

        criteria.add(Restrictions.eq(SysUserDomain.USER_NAME, userName))
                .add(Restrictions.ne(SysUserDomain.ID, id));
        SysUser sysUser = (SysUser) criteria.uniqueResult();
        if (null != sysUser) {
            return true;
        }
        return false;
    }

    /**
     * 根据用户名和密码查找
     *
     * @param userName 用户名
     * @param password 密码
     * @return
     */
    @Override
    public SysUserDto getByUserNameAndPassword(final String userName, final String password) {
        return super.findOne(
                Restrictions.eq(SysUserDomain.USER_NAME, userName),
                Restrictions.eq(SysUserDomain.PASSWORD, password),
                Restrictions.eq(SysUserDomain.STATUS, SysUserEnum.Status.NORMAL.getCode())
        );
    }

    /**
     * 根据用户名查找用户
     *
     * @param userName 用户名
     * @return
     */
    @Override
    public SysUserDto getByUserName(final String userName) {
        return super.findOneByProperty(SysUserDomain.USER_NAME, userName);
    }

    /**
     * 获取用户角色树
     *
     * @param id
     * @return
     */
    @Override
    public List<TreeNode> getUserRoleTree(final String id) {
        final SysUser sysUser = super.getBaseDao().get(SysUser.class, id);
        final Set<SysRole> sysRoles = sysUser.getRoles();
        final List<TreeNode> treeNodes = sysRoleService.getRoleTree();
        for (final TreeNode treeNode : treeNodes) {
            sysRoles.stream().filter(sysRoleDto -> treeNode.getId().equals(sysRoleDto.getId())).forEach(sysRoleDto -> treeNode.setChecked(true));
        }
        return treeNodes;
    }

    /**
     * 保存用户角色信息
     *
     * @param uid
     * @param roleIds
     */
    @Override
    public void saveUserRole(final String uid, final List<String> roleIds) {
        final SysUser sysUser = super.getBaseDao().get(SysUser.class, uid);
        final List<SysRole> sysRoles = sysRoleService.getByIds(roleIds);
        sysUser.setRoles(new HashSet<>(sysRoles));
        super.getBaseDao().update(sysUser);
    }

    /**
     * 获取用户可访问的菜单集合
     *
     * @param uid
     * @return
     */
    @Override
    public List<SysMenu> getUserMenu(final String uid) {
        final SysUser sysUser = super.getBaseDao().get(SysUser.class, uid);
        final Set<SysRole> sysRoles = sysUser.getRoles();
        final List<SysMenu> sysMenus = new ArrayList<>();
        final Set<String> menuIds = new HashSet<>();
        for (final SysRole sysRole : sysRoles) {
            final Set<SysMenu> sysMenuSet = sysRole.getMenus();
            for (final SysMenu sysMenu : sysMenuSet) {
                final String id = sysMenu.getId().toString();
                if (menuIds.contains(id)) {
                    continue;
                }
                menuIds.add(id);
                sysMenus.add(sysMenu);
            }
        }
        if (Objects.nonNull(sysMenus)) {
            Collections.sort(sysMenus, (o1, o2) -> {
                int a1 = 0;
                int a2 = 0;
                if (Objects.nonNull(o1.getQueue())) {
                    a1 = o1.getQueue().intValue();
                }
                if (Objects.nonNull(o2.getQueue())) {
                    a2 = o2.getQueue().intValue();
                }
                return a1 - a2;
            });
        }
        return sysMenus;
    }

    /**
     * 获取用户所能访问的菜单
     *
     * @param uid
     * @return
     */
    @Override
    public TreeNode getUserMenuTree(final String uid) {
        final List<SysMenu> sysMenus = getUserMenu(uid);
        final SysMenu root = sysMenuService.getRootMenu();

        return sysMenuService.buildMenuTree(root.getId(), sysMenus);
    }

    /**
     * Locates the user based on the username. In the actual implementation, the search
     * may possibly be case sensitive, or case insensitive depending on how the
     * implementation instance is configured. In this case, the <code>UserDetails</code>
     * object that comes back may have a username that is of a different case than what
     * was actually requested..
     *
     * @param username the username identifying the user whose data is required.
     * @return a fully populated user record (never <code>null</code>)
     * @throws UsernameNotFoundException if the user could not be found or the user has no
     *                                   GrantedAuthority
     */
    @Override
    public UserDetails loadUserByUsername(final String username) throws UsernameNotFoundException {
        final SysUser sysUser = super.getBaseDao().findOneByProperty(SysUser.class, SysUserDomain.USER_NAME, username);
        if (null == sysUser) {
            throw new UsernameNotFoundException(username);
        }
        final AuthUser authUser = new AuthUser(sysUser.getUserName(), sysUser.getPassword(), sysUser.getRoles());
        authUser.setUid(sysUser.getId());
        authUser.setNickName(sysUser.getNickName());
        authUser.setStatus(sysUser.getStatus());
        authUser.setEmail(sysUser.getEmail());
        authUser.setMobile(sysUser.getMobile());
        authUser.setLoginIp(sysUser.getLoginIp());
        authUser.setLastLoginTime(sysUser.getLastLoginTime());
        return authUser;
    }
}
