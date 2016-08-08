
package com.imchuan.resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 在线留言
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-13 16:52
 */
@Controller
@RequestMapping("/lm")
public class LeaveMessageResource {

    /**
     * 跳转到在线留言页面
     *
     * @return 页面名称
     */
    @RequestMapping
    public String gotoLeaveMessage() {
        return "leaveMessage";
    }

}
