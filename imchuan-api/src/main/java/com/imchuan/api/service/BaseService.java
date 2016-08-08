package com.imchuan.api.service;

import com.imchuan.api.pojo.AbstractEntity;
import com.imchuan.api.pojo.BaseDto;
import com.imchuan.api.pojo.GridExample;
import com.imchuan.api.pojo.Pagination;
import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Example;

import java.io.Serializable;
import java.util.List;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-10 19:19
 */
public interface BaseService<Model extends AbstractEntity, Dto extends BaseDto, Pk extends Serializable> {
    Criteria createCriteria();

    Model create();

    /**
     * 新增，返回主键
     *
     * @param dto
     * @return
     */
    Pk save(Dto dto);

    /**
     * 更新
     *
     * @param dto
     */
    void update(Dto dto);

    /**
     * 保存或更新
     *
     * @param dto
     */
    Dto saveOrUpdate(Dto dto);


    /**
     * 根据主键删除
     *
     * @param pk
     */
    void remove(Pk pk);

    /**
     * 根据主键集合删除
     *
     * @param pks
     */
    void remove(List<Pk> pks);

    /**
     * 根据主键获取对象
     *
     * @param pk
     * @return
     */
    Dto get(Pk pk);

    /**
     * 获取全部数据
     *
     * @return
     */
    List<Dto> findAll();

    List<Dto> find(String queryString, Object... params);

    List<Dto> find(Criterion... criterions);

    Dto findOne(Criterion... criterions);

    List<Dto> findByProperty(String name, Object value);

    Dto findOneByProperty(String name, Object value);

    Pagination<Dto> findPageByExample(GridExample gridExample, Example example);
}
