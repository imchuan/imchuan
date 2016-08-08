define([
    'jquery',
    'cargo2',
    'common/resource',
    'lte',
    'common/main'
], function ($, cargo2,Resource) {
    var resource = new Resource('/sys/role');

    var initTable = function () {
        $('#table').bootstrapTable({
            url: window.ctx + '/sys/role/search',
            columns: [
                {
                    field: 'operate',
                    checkbox: true,
                    sortable: false
                },
                {
                    field: 'code',
                    title: '角色代码'
                },
                {
                    field: 'name',
                    title: '角色名称'
                },
                {
                    field: 'remark',
                    title: '说明'
                },
                {
                    field: 'createdTime',
                    title: '创建时间'
                }
            ]
        });
    };

    var bindEvents = function () {
        $('#btnEdit').click(function () {
            var rows = $('#table').bootstrapTable('getSelections');
            if (rows && rows.length === 1) {
                window.location.href = window.ctx + '/sys/role/edit/' + rows[0].id;
            }else{
                layer.msg('请选择一条记录');
            }
        });
        $('#btnDelete').click(function () {
            var rows = $('#table').bootstrapTable('getSelections');
            if (rows && rows.length > 0) {
                var ids = cargo2.extractToArray(rows, 'id');
                resource.batchDelete(ids, function () {
                    $('#table').bootstrapTable('refresh');
                });
            }else{
                layer.msg('请选择一条记录');
            }
        });
    };

    $(function () {
        initTable();
        bindEvents();
    });
});