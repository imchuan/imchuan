package com.imchuan.resource.common;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 系统公共跳转
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-13 16:52
 */
@Controller
public class AppResource {
    /**
     * 跳转到后台管理首页
     *
     * @return
     */
    @RequestMapping("/")
    public String index() {
        return "admin";
    }
}
