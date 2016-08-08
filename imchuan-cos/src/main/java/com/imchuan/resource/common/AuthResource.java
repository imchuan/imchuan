package com.imchuan.resource.common;

import com.imchuan.api.pojo.TreeNode;
import com.imchuan.api.util.CookieUtils;
import com.imchuan.api.util.DateUitls;
import com.imchuan.api.util.PasswordUtils;
import com.imchuan.dto.sys.SysUserDto;
import com.imchuan.entity.sys.AuthUser;
import com.imchuan.security.TokenUtils;
import com.imchuan.service.sys.SysUserService;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.Objects;

/**
 * 用户认证
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-13 16:52
 */
@Controller
public class AuthResource {
    @Resource
    private SysUserService sysUserService;

    @Resource
    private AuthenticationManager authenticationManager;


    /**
     * 跳转到登陆界面
     *
     * @param e
     * @param model
     * @return
     */
    @RequestMapping(value = "/login")
    public String pageLogin(@RequestParam(value = "e", required = false) final String e, final Model model) {
        if (StringUtils.isNotBlank(e)) {
            model.addAttribute("e", true);
        }
        return "login";
    }

    /**
     * 用户认证
     *
     * @param sysUserDto
     * @param request
     * @return
     */
    @RequestMapping(value = "/authentication", method = RequestMethod.POST)
    public String login(@ModelAttribute final SysUserDto sysUserDto, final HttpServletRequest request, final HttpServletResponse response) {
        if (StringUtils.isAnyBlank(sysUserDto.getUserName(), sysUserDto.getPassword())) {
            return "redirect:/login?e=true";
        }
        final SysUserDto sysUser = sysUserService.getByUserNameAndPassword(sysUserDto.getUserName(), PasswordUtils.encryptPassword(sysUserDto.getPassword()));
        if (Objects.nonNull(sysUser)) {
            // 更新用户信息
            sysUser.setLoginIp(request.getRemoteAddr());
            sysUser.setLastLoginTime(DateFormatUtils.format(new Date(), DateUitls.Format.YYYY_MM_DD_HH_MM_SS));
            sysUserService.update(sysUser);

            final UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(sysUserDto.getUserName(), sysUserDto.getPassword());
            Authentication authentication = authenticationManager.authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            HttpSession session = request.getSession(true);
            //在session中存放security context,方便同一个session中控制用户的其他操作
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());


            //获取用户菜单
            final AuthUser currentUser = (AuthUser) authentication.getPrincipal();
            TreeNode treeNode = sysUserService.getUserMenuTree(currentUser.getUid());
            session.setAttribute("USER_MENUS", treeNode);

            // 生成token
            //final String token = TokenUtils.createToken(currentUser);
            //CookieUtils.setCookie(response, TokenUtils.COOKIE_KEY, token, (int) TokenUtils.EXPIRES);


            return "redirect:/";
        }
        return "redirect:/login?e=true";
    }

}
