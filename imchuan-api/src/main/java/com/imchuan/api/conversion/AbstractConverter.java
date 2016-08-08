package com.imchuan.api.conversion;

import com.imchuan.api.exceptions.ConversionException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 转换基类
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-19 17:25
 */
public abstract class AbstractConverter<S, T> {
    private T target;

    public T getTarget() {
        return target;
    }

    public void setTarget(T target) {
        this.target = target;
    }

    public abstract T convert(S source) throws ConversionException;

    public List<T> convertAll(List<S> sourceList) throws ConversionException {
        return sourceList.stream().map(this::convert).collect(Collectors.toList());
    }

    public Set<T> convertAll(Set<S> sourceList) throws ConversionException {
        return sourceList.stream().map(this::convert).collect(Collectors.toSet());
    }

    public abstract void populate(S source, T target);
}
