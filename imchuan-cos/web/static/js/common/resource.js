define([
    'jquery'
], function ($) {
    function Resource(url) {
        this.url = url;
    }

    /**
     * 保存
     * @param obj
     * @param successFn
     * @param errorFn
     */
    Resource.prototype.save = function (obj, successFn, errorFn) {
        $.ajax({
            type: 'POST',
            url: window.ctx + this.url,
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(obj),
            success: function (result) {
                if (result.status === '0') {
                    successFn && successFn(result.data);
                } else {
                    errorFn && errorFn(result);
                }
            }
        });
    };

    /**
     * 批量删除
     * @param ids
     * @param successFn
     * @param errorFn
     */
    Resource.prototype.batchDelete = function (ids, successFn, errorFn) {
        $.ajax({
            type: 'POST',
            url: window.ctx + this.url + '/batchDelete',
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(ids),
            success: function (result) {
                if (result.status === '0') {
                    successFn && successFn(result.data);
                } else {
                    errorFn && errorFn(result);
                }
            }
        });
    };
    /**
     * 删除
     * @param id
     * @param successFn
     * @param errorFn
     */
    Resource.prototype.delete = function (id, successFn, errorFn) {
        $.ajax({
            type: 'POST',
            url: window.ctx + this.url + '/delete',
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(id),
            success: function (result) {
                if (result.status === '0') {
                    successFn && successFn(result.data);
                } else {
                    errorFn && errorFn(result);
                }
            }
        });
    };
    return Resource;
});
