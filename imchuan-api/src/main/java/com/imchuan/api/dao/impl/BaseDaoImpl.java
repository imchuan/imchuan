package com.imchuan.api.dao.impl;

import com.imchuan.api.dao.BaseDao;
import com.imchuan.api.pojo.AbstractEntity;
import com.imchuan.api.pojo.GridExample;
import com.imchuan.api.pojo.Pagination;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-19 20:13
 */
@Component("baseDao")
public class BaseDaoImpl<T extends AbstractEntity, Pk extends Serializable> implements BaseDao<T, Pk> {
    public static final Logger LOG = LoggerFactory.getLogger(BaseDaoImpl.class);
    @Autowired
    private SessionFactory sessionFactory;


    public Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public Criteria createCriteria(Class clazz) {
        return getSession().createCriteria(clazz);
    }

    @Override
    public Query createQuery(String hql) {
        return getSession().createQuery(hql);
    }

    @Override
    public void flush() {
        getSession().flush();
    }

    @Override
    public T create(Class<T> clazz) {
        try {
            return clazz.newInstance();
        } catch (InstantiationException e) {
            LOG.error("<InstantiationException> : " + e.getMessage());
        } catch (IllegalAccessException e) {
            LOG.error("<IllegalAccessException> : " + e.getMessage());
        }
        return null;
    }

    /**
     * 新增，返回主键
     *
     * @param model
     * @return
     */
    @Override
    public Pk save(T model) {
        preSave(model);
        return (Pk) getSession().save(model);
    }

    /**
     * 更新
     *
     * @param model
     */
    @Override
    public void update(T model) {
        preSave(model);
        getSession().update(model);
    }

    /**
     * 保存或更新
     *
     * @param model
     */
    @Override
    public void saveOrUpdate(T model) {
        preSave(model);
        getSession().saveOrUpdate(model);
    }

    /**
     * 删除对象
     *
     * @param model
     */
    @Override
    public void remove(T model) {
        getSession().delete(model);
    }

    /**
     * 根据主键删除
     *
     * @param clazz
     * @param pk
     */
    @Override
    public void remove(Class<T> clazz, Pk pk) {
        getSession().delete(get(clazz, pk));
    }

    /**
     * 根据主键集合删除
     *
     * @param clazz
     * @param pks
     */
    @Override
    public void remove(Class<T> clazz, List<Pk> pks) {
        for (Pk pk : pks) {
            remove(clazz, pk);
        }
    }

    /**
     * 根据主键获取对象
     *
     * @param clazz
     * @param pk
     * @return
     */
    @Override
    public T get(Class<T> clazz, Pk pk) {
        return getSession().load(clazz, pk);
    }

    /**
     * 获取全部数据
     *
     * @param clazz
     * @return
     */
    @Override
    public List<T> findAll(Class<T> clazz) {
        return createCriteria(clazz).list();
    }

    @Override
    public List<T> find(String queryString, Object... params) {
        final Query query = getSession().createQuery(queryString);
        if (null != params) {
            for (int i = 0; i < params.length; i++) {
                query.setParameter(i, params[i]);
            }
        }
        return query.list();
    }

    @Override
    public List<T> find(Class<T> clazz, Criterion... criterions) {
        Criteria criteria = createCriteria(clazz);
        for (Criterion criterion : criterions) {
            criteria.add(criterion);
        }
        return criteria.list();
    }

    @Override
    public T findOne(Class<T> clazz, Criterion... criterions) {
        Criteria criteria = createCriteria(clazz);
        for (Criterion criterion : criterions) {
            criteria.add(criterion);
        }
        return (T) criteria.uniqueResult();
    }

    @Override
    public List<T> findByProperty(Class<T> clazz, String name, Object value) {
        Criteria criteria = createCriteria(clazz);
        criteria.add(Restrictions.eq(name, value));
        return criteria.list();
    }

    @Override
    public T findOneByProperty(Class<T> clazz, String name, Object value) {
        Criteria criteria = createCriteria(clazz);
        criteria.add(Restrictions.eq(name, value));
        return (T) criteria.uniqueResult();
    }

    @Override
    public Pagination findPageByExample(Class<T> clazz, GridExample gridExample, Example example) {
        Criteria criteria = createCriteria(clazz);
        if (example != null) {
            criteria.add(example);
        }
        final String order = gridExample.getOrder();
        if (StringUtils.isNotBlank(gridExample.getSortName()) && StringUtils.isNotBlank(order)) {
            if ("asc".equals(order)) {
                criteria.addOrder(Order.asc(gridExample.getSortName()));
            } else {
                criteria.addOrder(Order.desc(gridExample.getSortName()));
            }
        }
        Long rowCount = (Long) criteria.setProjection(Projections.rowCount()).uniqueResult();
        criteria.setProjection(null);
        criteria.setFirstResult((gridExample.getPage() - 1) * gridExample.getSize());
        criteria.setMaxResults(gridExample.getSize());
        List<T> result = criteria.list();
        Pagination pagination = new Pagination(gridExample.getPage(), gridExample.getSize());
        pagination.setRows(result);
        pagination.setTotal(rowCount);
        return pagination;
    }

    private void preSave(T model) {
        if (StringUtils.isBlank(model.getId())) {
            model.setCreatedTime(new Date());
        }
        model.setModifiedTime(new Date());
    }
}
