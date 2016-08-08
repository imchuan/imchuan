define([
    'jquery',
    'cargo2',
    'common/resource',
    'lte',
    'common/main'
], function ($, cargo2, Resource) {
    var resource = new Resource('/sys/user');
    var initTable = function () {
        $('#table').bootstrapTable({
            url: window.ctx + '/sys/user/search',
            columns: [
                {
                    field: 'operate',
                    checkbox: true,
                    sortable: false
                },
                {
                    field: 'userName',
                    title: '用户名'
                },
                {
                    field: 'nickName',
                    title: '昵称'
                },
                {
                    field: 'mobile',
                    title: '手机号'
                },
                {
                    field: 'remark',
                    title: '备注'
                },
                {
                    field: 'lastLoginTime',
                    title: '最后登陆时间'
                },
                {
                    field: 'createdTime',
                    title: '创建时间'
                }
            ]
        });
    };

    var search = function () {
        $('#table').bootstrapTable('refresh');
    };

    var bindEvents = function () {

        $('#btnEdit').click(function () {
            var rows = $('#table').bootstrapTable('getSelections');
            if (rows && rows.length === 1) {
                window.location.href = window.ctx + '/sys/user/edit/' + rows[0].id;
            } else {
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
            } else {
                layer.msg('请选择一条记录');
            }
        });
        // 查看用户角色
        $('#btnUserRole').click(function () {
            var rows = $('#table').bootstrapTable('getSelections');
            if (rows && rows.length === 1) {
                var ids = cargo2.extractToArray(rows, 'id');
                layer.open({
                    type: 2,
                    title: '用户角色编辑',
                    shadeClose: true,
                    shade: 0.8,
                    area: ['500px', '400px'],
                    content: window.ctx + '/sys/user/userRoleIndex?uid=' + ids[0]
                });

            } else {
                layer.msg('请选择一条记录');
            }
        });

        $('#btnSearch').bind('click', search);
    };

    $(function () {
        initTable();
        bindEvents();
    });
});