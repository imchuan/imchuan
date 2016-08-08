package com.imchuan.api.front;

import com.imchuan.api.pojo.Pagination;

/**
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-13 16:52
 */
public class AppResponse {
    private AppResponse() {

    }

    public static final AppResult success(final Object data) {
        return new AppResult.Builder().status(AppStatus.OK).data(data).build();
    }

    public static final AppResult success() {
        return new AppResult.Builder().status(AppStatus.OK).build();
    }

    public static final AppResult error(final AppStatus status) {
        return new AppResult.Builder().status(status).build();
    }

    public static final AppResult error(final AppStatus status, final String message) {
        return new AppResult.Builder().status(status).info(message).build();
    }

    public static final AppResult page(final Pagination pagination) {
        return new AppResult.Builder().status(AppStatus.OK).data(pagination.getRows()).total(pagination.getTotal()).build();
    }
}
