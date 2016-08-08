package com.imchuan.api.service.impl;

import com.imchuan.api.conversion.AbstractConverter;
import com.imchuan.api.dao.BaseDao;
import com.imchuan.api.pojo.AbstractEntity;
import com.imchuan.api.pojo.BaseDto;
import com.imchuan.api.pojo.GridExample;
import com.imchuan.api.pojo.Pagination;
import com.imchuan.api.service.BaseService;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Example;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.util.List;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-20 14:23
 */
@Transactional
@Component("baseService")
public abstract class BaseServiceImpl<Model extends AbstractEntity, Dto extends BaseDto, Pk extends Serializable> implements BaseService<Model, Dto, Pk> {
    @Autowired
    private BaseDao<Model, Pk> baseDao;
    private AbstractConverter<Dto, Model> dtoToModel;

    private AbstractConverter<Model, Dto> modelToDto;

    public abstract void initConverter();

    public BaseDao<Model, Pk> getBaseDao() {
        return baseDao;
    }

    public void setConverter(AbstractConverter<Dto, Model> dtoToModel, AbstractConverter<Model, Dto> modelToDto) {
        this.dtoToModel = dtoToModel;
        this.modelToDto = modelToDto;
    }

    private Class<Model> clazz;

    public BaseServiceImpl() {
        clazz = (Class<Model>) ((ParameterizedType) getClass()
                .getGenericSuperclass()).getActualTypeArguments()[0];
    }

    @Override
    public Criteria createCriteria() {
        return getBaseDao().createCriteria(clazz);
    }

    @Override
    public Model create() {
        return getBaseDao().create(clazz);
    }

    /**
     * 新增，返回主键
     *
     * @param dto
     * @return
     */
    @Override
    public Pk save(Dto dto) {
        dtoToModel.setTarget(create());
        return getBaseDao().save(dtoToModel.convert(dto));
    }

    /**
     * 更新
     *
     * @param dto
     */
    @Override
    public void update(Dto dto) {
        Model model = getBaseDao().get(clazz, (Pk) dto.getId());
        dtoToModel.setTarget(model);
        getBaseDao().update(dtoToModel.convert(dto));
    }

    /**
     * 保存或更新
     *
     * @param dto
     */
    @Override
    public Dto saveOrUpdate(Dto dto) {
        Dto result;
        if (StringUtils.isNotBlank(dto.getId())) {
            update(dto);
            result = dto;
        } else {
            Pk pk = save(dto);
            result = get(pk);
        }
        return result;
    }

    /**
     * 根据主键删除
     *
     * @param pk
     */
    @Override
    public void remove(Pk pk) {
        getBaseDao().remove(clazz, pk);
    }

    /**
     * 根据主键集合删除
     *
     * @param pks
     */
    @Override
    public void remove(List<Pk> pks) {
        getBaseDao().remove(clazz, pks);
    }

    /**
     * 根据主键获取对象
     *
     * @param pk
     * @return
     */
    @Override
    public Dto get(Pk pk) {
        Model model = getBaseDao().get(clazz, pk);
        if (null != model) {
            return modelToDto.convert(model);
        }
        return null;
    }

    /**
     * 获取全部数据
     *
     * @return
     */
    @Override
    public List<Dto> findAll() {
        List<Model> list = getBaseDao().findAll(clazz);
        return modelToDto.convertAll(list);
    }

    @Override
    public List<Dto> find(String queryString, Object... params) {
        List<Model> list = getBaseDao().find(queryString, params);
        return modelToDto.convertAll(list);
    }

    @Override
    public List<Dto> find(Criterion... criterions) {
        return modelToDto.convertAll(getBaseDao().find(clazz, criterions));
    }

    @Override
    public Dto findOne(Criterion... criterions) {
        Model model = getBaseDao().findOne(clazz, criterions);
        if (null != model) {
            return modelToDto.convert(model);
        }
        return null;
    }


    @Override
    public List<Dto> findByProperty(String name, Object value) {
        List<Model> list = getBaseDao().findByProperty(clazz, name, value);
        return modelToDto.convertAll(list);
    }

    @Override
    public Dto findOneByProperty(String name, Object value) {
        Model model = getBaseDao().findOneByProperty(clazz, name, value);
        if (null != model) {
            return modelToDto.convert(model);
        }
        return null;
    }

    @Override
    public Pagination<Dto> findPageByExample(GridExample gridExample, Example example) {
        Pagination<Model> modelPagination = getBaseDao().findPageByExample(clazz, gridExample, example);
        Pagination<Dto> result = new Pagination<>(modelPagination.getPage(), modelPagination.getSize());
        result.setRows(modelToDto.convertAll(modelPagination.getRows()));
        result.setTotal(modelPagination.getTotal());
        return result;
    }


}
