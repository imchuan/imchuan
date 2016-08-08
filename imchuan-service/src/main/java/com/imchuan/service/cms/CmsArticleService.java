package com.imchuan.service.cms;

import com.imchuan.api.front.AppResult;
import com.imchuan.api.pojo.GridExample;
import com.imchuan.api.pojo.Pagination;
import com.imchuan.api.service.BaseService;
import com.imchuan.dto.cms.CmsArticleDto;
import com.imchuan.entity.cms.CmsArticle;

import java.util.List;

/**
 * 文章管理
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-10 20:34
 */
public interface CmsArticleService extends BaseService<CmsArticle, CmsArticleDto, String> {

    /**
     * 新增文章
     *
     * @param cmsArticleDto 文章对象
     */
    CmsArticleDto saveArticle(final CmsArticleDto cmsArticleDto);

    /**
     * 更新文章
     *
     * @param cmsArticleDto 文章对象
     * @return
     */
    CmsArticleDto updateArticle(final CmsArticleDto cmsArticleDto);

    /**
     * 查询列表
     *
     * @param condition   查询条件
     * @param gridExample 表格属性
     * @return
     */
    Pagination<CmsArticleDto> getList(final CmsArticleDto condition, final GridExample gridExample);

    /**
     * 获取文章最大编号
     *
     * @return 最大编号
     */
    Integer getMaxNo();

    /**
     * 数据校验
     *
     * @param cmsArticleDto 文章对象
     * @return 消息对象
     */
    AppResult validate(final CmsArticleDto cmsArticleDto);

    /**
     * 置顶
     *
     * @param ids 文章id列表
     */
    void toTop(final List<String> ids);

    /**
     * 上架
     *
     * @param ids 文章id列表
     */
    void putAway(final List<String> ids);

    /**
     * 下架
     *
     * @param ids 文章id列表
     */
    void soldOut(final List<String> ids);

}