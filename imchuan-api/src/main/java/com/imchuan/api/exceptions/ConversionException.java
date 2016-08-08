package com.imchuan.api.exceptions;

/**
 * 转换异常
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-19 17:25
 */
public class ConversionException extends RuntimeException {

    private static final long serialVersionUID = 7065408905951769507L;

    public ConversionException(String message, Throwable cause) {
        super(message, cause);
    }

    public ConversionException(String message) {
        super(message);
    }
}