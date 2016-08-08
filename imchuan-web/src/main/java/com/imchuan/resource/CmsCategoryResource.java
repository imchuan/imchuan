
package com.imchuan.resource;

import com.imchuan.api.pojo.TreeNode;
import com.imchuan.service.cms.CmsCategoryService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

/**
 * 栏目
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-13 16:52
 */
@Controller
@RequestMapping
public class CmsCategoryResource {
    @Resource
    private CmsCategoryService cmsCategoryService;

    /**
     * 获取栏目
     *
     * @return
     */
    @RequestMapping(value = "/categoryList")
    @ResponseBody
    public TreeNode getCategory() {
        return cmsCategoryService.getTree();
    }

}
