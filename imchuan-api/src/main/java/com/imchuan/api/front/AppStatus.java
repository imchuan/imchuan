package com.imchuan.api.front;


/**
 * 系统状态码
 *
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-13 16:52
 */
public enum AppStatus {
    /**
     * 请求成功
     */
    OK(0, "成功"),
    /**
     * 请求出错
     */
    ERR(1, "错误"),
    /**
     * 参数错误
     */
    ERR_PARAMS(101, "参数错误"),
    /**
     * 参数数据格式错误
     */
    ERR_PARAMS_DATA(102, "参数数据格式错误"),
    /**
     * 业务出错
     */
    ERR_BUSINESS(103, "业务出错");


    private int code;
    private String reason;

    private AppStatus(final int statusCode, final String reasonPhrase) {
        this.code = statusCode;
        this.reason = reasonPhrase;
    }

    public int getCode() {
        return this.code;
    }

    public String getReason() {
        return this.reason;
    }
}
