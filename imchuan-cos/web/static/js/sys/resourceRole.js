define([
    'jquery',
    'cargo2',
    'lte',
    'zTree',
    'common/main'
], function ($, cargo2) {
    var roleId = '', rowCheckIndex = [];

    var initTreeRole = function () {
        var setting = {
            data: {
                simple: true
            },
            async: {
                enable: true,
                url: window.ctx + '/sys/role/tree',
                contentType: 'application/json',
                type: 'get',
                dataType: 'json'
            },
            view: {
                dblClickExpand: false
            },
            callback: {
                onClick: itemClick
            }
        };

        function itemClick(event, treeId, treeNode) {
            roleId = treeNode.id;
            search();
        }

        $.fn.zTree.init($('#treeRole'), setting);

    };
    var initTable = function () {
        $('#table').bootstrapTable({
            url: window.ctx + '/sys/sysResource/listByRoleId',
            columns: [
                {
                    field: 'operate',
                    checkbox: true,
                    sortable: false
                },
                {
                    field: 'name',
                    title: '资源名称'
                },
                {
                    field: 'url',
                    title: '路径'
                },
                {
                    field: 'remark',
                    title: '备注',
                    formatter: function (value, row, index) {
                        if (row.checked === true) {
                            rowCheckIndex.push(String(index));
                        }
                    }
                }
            ],
            onLoadSuccess: function () {
                $('#table').find('.bs-checkbox>input:checkbox').each(function () {
                    var index = $(this).attr('data-index');
                    if ($.inArray(index, rowCheckIndex) != -1) {
                        $(this).trigger('click');
                    }
                });
            },
            responseHandler: function (res) {
                rowCheckIndex = [];
                return res;
            }
        });
    };

    var search = function () {
        var params = $('#form').serializeJson();
        if (cargo2.isNotBlank(roleId)) {
            params.roleId = roleId;
        }

        $('#table').bootstrapTable('refresh', {
            query: $.extend({}, {}, params)
        });

    };

    var save = function () {
        if (cargo2.isNotBlank(roleId)) {
            var rows = $('#table').bootstrapTable('getSelections');
            var ids = [];
            if (rows && rows.length > 0) {
                ids = cargo2.extractToArray(rows, 'id');
            }
            $.ajax({
                type: 'POST',
                url: window.ctx + '/sys/sysResource/saveResourceRole/' + roleId,
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                data: JSON.stringify(ids),
                success: function () {
                    layer.msg('操作成功');
                }
            });
        } else {
            layer.msg('请选择角色');
        }
    };

    var bindEvents = function () {
        $('#btnSearch').bind('click', search);
        $('#btnSave').bind('click', save);
    };

    $(function () {
        initTreeRole();
        initTable();
        bindEvents();
    });
});