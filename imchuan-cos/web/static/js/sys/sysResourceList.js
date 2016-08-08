define([
    'jquery',
    'cargo2',
    'lte',
    'common/main'
], function ($, cargo2) {
    var initTable = function () {
        $('#table').bootstrapTable({
            height: 470,
            url: window.ctx + '/sys/resource/list',
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
                    title: '备注'
                },
                {
                    field: 'creationTime',
                    title: '创建时间'
                }
            ],
            onCheck: function (row) {
                $('#btnDelete').attr('disabled', false);
                $('#btnSave').attr('disabled', false);
                $('#btnCancel').attr('disabled', false);
                setForm(row);
            },
            onUncheck: function () {
                $('#btnDelete').attr('disabled', true);
                $('#btnSave').attr('disabled', true);
                $('#btnCancel').attr('disabled', true);
                clear();
            }
        });
    };

    var search = function () {
        var params = $('#form').serializeJson();

        $('#table').bootstrapTable('refresh', {
            query: $.extend({}, {}, params)
        });
    };

    var add = function () {
        clear();
        $('#btnSave').attr('disabled', false);
        $('#btnCancel').attr('disabled', false);
    };

    var save = function () {
        var formData = $('#form').serializeJson();

        $.ajax({
            type: 'POST',
            url: window.ctx + '/sys/resource',
            data: JSON.stringify(formData),
            success: function (result) {
                if (result.status === '0') {
                    $('#table').bootstrapTable('refresh');
                    $('#btnSave').attr('disabled', true);
                    $('#btnCancel').attr('disabled', true);
                    clear();
                    layer.msg('操作成功');
                }
            }
        });
    };

    var cancel = function () {
        clear();
        $('#btnSave').attr('disabled', true);
        $('#btnCancel').attr('disabled', true);
    };

    var remove = function () {
        var rows = $('#table').bootstrapTable('getSelections');
        if (rows && rows.length > 0) {
            var ids = cargo2.extractToArray(rows, 'id');
            $.ajax({
                type: 'POST',
                url: window.ctx + '/sys/resource/batchDelete',
                data: JSON.stringify(ids),
                success: function (result) {
                    if (result.status === '0') {
                        $('#table').bootstrapTable('refresh');
                        $('#btnDelete').attr('disabled', true);
                        layer.msg('操作成功');
                    }
                }
            });
        } else {
            layer.msg('请选择一条记录');
        }
    };

    var setForm = function (row) {
        if (row) {
            $('#entityId').val(row.id);
            $('#url').val(row.url);
            $('#name').val(row.name);
            $('#remark').val(row.remark);
        }
    };

    var clear = function () {
        $('#form').find('input').val('');
    };

    var bindEvents = function () {
        $('#btnSearch').bind('click', search);
        $('#btnNew').bind('click', add);
        $('#btnCancel').bind('click', cancel);
        $('#btnSave').bind('click', save);
        $('#btnDelete').bind('click', remove);
        $('#btnClear').bind('click', clear);
    };

    var initButtonStatus = function () {
        $('#btnSave').attr('disabled', true);
        $('#btnCancel').attr('disabled', true);
        $('#btnDelete').attr('disabled', true);
    };

    $(function () {
        initTable();
        bindEvents();
        initButtonStatus();
    });
});