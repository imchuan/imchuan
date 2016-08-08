
package com.imchuan.resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 关于
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-13 16:52
 */
@Controller
@RequestMapping("/about")
public class AboutResource {

    /**
     * 跳转到关于我页面
     *
     * @return 页面名称
     */
    @RequestMapping
    public String gotoAbout() {
        return "about";
    }

}
