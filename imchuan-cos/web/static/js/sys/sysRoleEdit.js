define([
    'jquery',
    'cargo2',
    'common/resource',
    'lte',
    'common/main'
], function ($, cargo2, Resource) {
    var resource = new Resource('/sys/role');
    var save = function () {
        var formData = $('#form').serializeJson();
        refreshButtonStatus(true);
        resource.save(formData, function (obj) {
            $('#id').val(obj.id);
            layer.msg('保存成功');
            refreshButtonStatus();
        }, function (result) {
            layer.msg(result.info);
            refreshButtonStatus();
        });
    };

    var refreshButtonStatus = function (isSubmit) {
        $('#btnSave').empty();
        if (isSubmit) {
            $('#btnSave').append('<i class="fa fa-spinner"></i> 提交中...');
            $('#btnSave').attr('disabled', true);
        } else {
            $('#btnSave').append('保存');
            $('#btnSave').attr('disabled', false);
        }
    };

    $(function () {
        var id = $('#id').val();
        if (id) {
            $('#code').attr('readonly', true);
        }
        $('#btnSave').click(save);
    });
});