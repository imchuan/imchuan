package com.imchuan.api.dao;

import com.imchuan.api.pojo.AbstractEntity;
import com.imchuan.api.pojo.GridExample;
import com.imchuan.api.pojo.Pagination;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Example;

import java.io.Serializable;
import java.util.List;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-10 19:19
 */
public interface BaseDao<T extends AbstractEntity, Pk extends Serializable> {
    Criteria createCriteria(Class<T> clazz);

    Query createQuery(String hql);

    void flush();

    T create(Class<T> clazz);

    /**
     * 新增，返回主键
     *
     * @param model
     * @return
     */
    Pk save(T model);

    /**
     * 更新
     *
     * @param model
     */
    void update(T model);

    /**
     * 保存或更新
     *
     * @param model
     */
    void saveOrUpdate(T model);

    /**
     * 删除对象
     *
     * @param model
     */
    void remove(T model);

    /**
     * 根据主键删除
     *
     * @param clazz
     * @param pk
     */
    void remove(Class<T> clazz, Pk pk);

    /**
     * 根据主键集合删除
     *
     * @param clazz
     * @param pks
     */
    void remove(Class<T> clazz, List<Pk> pks);

    /**
     * 根据主键获取对象
     *
     * @param clazz
     * @param pk
     * @return
     */
    T get(Class<T> clazz, Pk pk);

    /**
     * 获取全部数据
     *
     * @param clazz
     * @return
     */
    List<T> findAll(Class<T> clazz);

    List<T> find(String queryString, Object... params);

    List<T> find(Class<T> clazz, Criterion... criterions);

    T findOne(Class<T> clazz, Criterion... criterions);

    List<T> findByProperty(Class<T> clazz, String name, Object value);

    T findOneByProperty(Class<T> clazz, String name, Object value);

    Pagination findPageByExample(Class<T> clazz, GridExample gridExample, Example example);
}
