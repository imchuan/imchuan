define([
    'jquery',
    'lte',
    'common/main'
], function ($) {

    $(function () {
        var code = $('#code').val();
        if (code) {
            $('#code').attr('readonly', true);
        }
    });
});