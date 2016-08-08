define([
    'jquery',
    'cargo2',
    'common/resource',
    'lte',
    'common/main',
    'select2'
], function ($, cargo2, Resource) {
    var resource = new Resource('/cms/article');

    var initTable = function () {
        $('#table').bootstrapTable({
            url: window.ctx + '/cms/article/search',
            columns: [
                {
                    field: 'operate',
                    checkbox: true,
                    sortable: false
                },
                {
                    field: 'articleNo',
                    title: '编号'
                },
                {
                    field: 'title',
                    title: '标题'
                },
                {
                    field: 'categoryNames',
                    title: '所属栏目',
                    sortable: false,
                    formatter: function (value, row, index) {
                        var array = [], template = '';
                        if (row.categoryNames) {
                            array = row.categoryNames.split(',');
                            $.each(array, function (i, item) {
                                template += '<span class="label label-default">' + item + '</span> ';
                            });
                        }
                        return template;
                    }
                },
                {
                    field: 'tags',
                    title: '标签',
                    sortable: false,
                    formatter: function (value, row, index) {
                        var array = [], template = '';
                        if (row.tags) {
                            array = row.tags.split(',');
                            $.each(array, function (i, item) {
                                template += '<span class="label label-default">' + item + '</span> ';
                            });
                        }
                        return template;
                    }
                },
                {
                    field: 'isTop',
                    title: '是否置顶',
                    formatter: function (value, row, index) {
                        if (row.isTop === '1') {
                            return '<span class="label label-success">是</span>';
                        } else {
                            return '否';
                        }
                    }
                },
                {
                    field: 'publishTime',
                    title: '发布时间'
                },
                {
                    field: 'createdTime',
                    title: '创建时间'
                },
                {
                    field: 'status',
                    title: '状态',
                    sortable: false,
                    formatter: function (value, row, index) {
                        if (row.status === 'NEW') {
                            return '<span class="label label-warning">草稿</span>';
                        } else if (row.status === 'RELEASED') {
                            return '<span class="label label-success">已发布</span>';
                        } else if (row.status === 'UNRELEASED') {
                            return '已下架';
                        }
                    }
                }
            ]
        });
    };

    var search = function () {
        var formData = $('#form').serializeJson();
        var categoryIds = $('#selCategory').val();
        var tags = $('#selTags').select2('data');

        if (categoryIds) {
            formData.categoryIds = categoryIds.join(',');
        }
        if (tags) {
            var tagNames = cargo2.extractToArray(tags, 'text');
            formData.tags = tagNames.join(',');
        }
        formData.isTop = formData.isTop || '0';

        console.log(formData);
        $('#table').bootstrapTable('refresh', {
            query: formData
        });
    };

    var bindEvents = function () {

        $('#btnEdit').click(function () {
            var rows = $('#table').bootstrapTable('getSelections');
            if (rows && rows.length === 1) {
                window.location.href = window.ctx + '/cms/article/edit/' + rows[0].id;
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

        $('#btnSearch').bind('click', search);

        $('#btnRest').bind('click', function () {
            $('#form input select').val('');
        });

        $('#btnTop').bind('click', function () {
            var rows = $('#table').bootstrapTable('getSelections');
            if (rows && rows.length > 0) {
                var ids = cargo2.extractToArray(rows, 'id');
                $.post(window.ctx + '/cms/article/toTop', JSON.stringify(ids), function () {
                    $('#table').bootstrapTable('refresh');
                    layer.msg('置顶成功');
                });
            } else {
                layer.msg('请选择一条记录');
            }
        });
        $('#btnPutAway').bind('click', function () {
            var rows = $('#table').bootstrapTable('getSelections');
            if (rows && rows.length > 0) {
                var ids = cargo2.extractToArray(rows, 'id');
                $.post(window.ctx + '/cms/article/putAway', JSON.stringify(ids), function () {
                    $('#table').bootstrapTable('refresh');
                    layer.msg('上架成功');
                });
            } else {
                layer.msg('请选择一条记录');
            }
        });
        $('#btnSoldOut').bind('click', function () {
            var rows = $('#table').bootstrapTable('getSelections');
            if (rows && rows.length > 0) {
                var ids = cargo2.extractToArray(rows, 'id');
                $.post(window.ctx + '/cms/article/soldOut', JSON.stringify(ids), function () {
                    $('#table').bootstrapTable('refresh');
                    layer.msg('下架成功');
                });
            } else {
                layer.msg('请选择一条记录');
            }
        });
    };

    var init = function () {
        $.get(window.ctx + '/cms/category/select2', function (result) {
            $('#selCategory').select2({
                data: result,
                multiple: true,
                minimumResultsForSearch: Infinity
            });
        });
        $.get(window.ctx + '/cms/tags/select2', function (result) {
            $('#selTags').select2({
                tags: true,
                multiple: true,
                tokenSeparators: [',', ' '],
                data: result
            });
        });
    };
    $(function () {
        initTable();
        bindEvents();
        init();
    });
});