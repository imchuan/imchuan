package com.imchuan.api.front;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.io.Serializable;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AppResult implements Serializable {
    private static final long serialVersionUID = -2587330182525511966L;
    private String status;
    private String info;
    private Object data;
    private long total;

    public AppResult(Builder builder) {
        this.status = builder.status;
        this.info = builder.info;
        this.data = builder.data;
        this.total = builder.total;
    }

    public String getStatus() {
        return status;
    }

    public String getInfo() {
        return info;
    }

    public Object getData() {
        return data;
    }

    public long getTotal() {
        return total;
    }

    public static class Builder {
        private String status;
        private String info;
        private Object data;
        private long total;

        public Builder status(AppStatus status) {
            this.status = String.valueOf(status.getCode());
            this.info = status.getReason();
            return this;
        }

        public Builder info(String info) {
            this.info = info;
            return this;
        }

        public Builder data(Object data) {
            this.data = data;
            return this;
        }

        public Builder total(long total) {
            this.total = total;
            return this;
        }

        public AppResult build() {
            return new AppResult(this);
        }
    }
}
