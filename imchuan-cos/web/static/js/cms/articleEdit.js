define([
    'jquery',
    'cargo2',
    'lte',
    'common/main',
    'select2',
    'kindeditor-cn'
], function ($, cargo2) {
    var contentEditor;
    var init = function () {
        $.get(window.ctx + '/cms/category/select2', function (result) {
            var categoryIds = $('#categoryIds').val(),
                categories = [];
            if (categoryIds) {
                categories = categoryIds.split(',');
            }
            $('#selCategory').select2({
                data: result,
                multiple: true,
                placeholder: '请选择栏目',
                minimumResultsForSearch: Infinity,
                initSelection: function (element, callback) {
                    var initVal;

                    initVal = cargo2.filter(result, function (item) {
                        return $.inArray(item.id, categories) != -1;
                    });
                    callback(initVal);
                }
            }).change(function () {
                var value = $(this).val();
                if (value) {
                    $('#categoryIds').val(value.join(','));
                } else {
                    $('#categoryIds').val('');
                }
            });

            $('#selCategory').select2('val', categories);
        });
        $.get(window.ctx + '/cms/tags/select2', function (result) {
            var tags = $('#tags').val(), array = [];
            if (tags) {
                array = tags.split(',');
            }
            $('#selTags').select2({
                tags: true,
                multiple: true,
                tokenSeparators: [',', ' '],
                data: result,
                initSelection: function (element, callback) {
                    var initVal;

                    initVal = cargo2.filter(result, function (item) {
                        return $.inArray(item.text, array) != -1;
                    });
                    callback(initVal);
                }
            }).change(function () {
                var tags = $('#selTags').select2('data');
                if (tags) {
                    var tagNames = cargo2.extractToArray(tags, 'text');
                    $('#tags').val(tagNames.join(','));
                } else {
                    $('#tags').val('');
                }
            });
            var ids = [];
            $.each(result, function () {
                if ($.inArray(this.text, array) != -1) {
                    ids.push(this.id);
                }
            });
            $('#selTags').select2('val', ids);
        });
        $('#cbxIsTop').iCheck({
            checkboxClass: 'icheckbox_flat-blue',
            increaseArea: '20%' // optional
        }).on('ifChecked', function (event) {
            $('#isTop').val('1');
        }).on('ifUnchecked', function (event) {
            $('#isTop').val('0');
        });

        contentEditor = KindEditor.create('#txtContent', {
            width: '1000px',
            height: '400px',
            filterMode: false,
            uploadJson: window['ctx'] + '/libs/kindeditor/jsp/upload_json.jsp',
            afterCreate: function (id) {
            }
        });

        if ($('#isTop').val() === '1') {
            $('#cbxIsTop').iCheck('check');
        }
    };

    /**
     * 保存草稿
     */
    var saveDraft = function () {
        $.when(save()).done(function (result) {
            if (result.status === '0') {
                layer.msg('保存成功');
                setTimeout(function () {
                    window.location.href = window.ctx + '/cms/article/edit/' + result.data.id;
                }, 1000);
            }
        });
    };

    /**
     * 保存
     */
    var save = function () {
        contentEditor.sync();
        var formData = $('#form').serializeJson();
        formData.isTop = formData.isTop || '0';
        return $.post(window.ctx + '/cms/article', JSON.stringify(formData));
    };

    /**
     * 保存并上架
     */
    var putAway = function () {
        $.when(save()).done(function (result) {
            if (result.status === '0') {
                var ids = [];
                ids.push(result.data.id);
                $.post(window.ctx + '/cms/article/putAway', JSON.stringify(ids), function () {
                    layer.msg('上架成功');
                    setTimeout(function () {
                        window.location.href = window.ctx + '/cms/article/edit/' + result.data.id;
                    }, 1000);
                });
            }
        });
    };
    /**
     * 下架
     */
    var soldOut = function () {
        var id = $('#id').val();
        var ids = [];
        ids.push(id);
        $.post(window.ctx + '/cms/article/soldOut', JSON.stringify(ids), function () {
            layer.msg('下架成功');
            setTimeout(function () {
                window.location.href = window.ctx + '/cms/article/edit/' + id;
            }, 1000);
        });
    };

    var bindEvents = function () {
        $('#btnSave').on('click', saveDraft);
        $('#btnSaveAndPutAway').on('click', putAway);
        $('#btnSoldOut').on('click', soldOut);
    };

    $(function () {
        init();
        bindEvents();
    });
});