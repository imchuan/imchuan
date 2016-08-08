define([
    'jquery'
], function ($) {

    var initCategory = function () {
        $.get(window.ctx + '/categoryList', function (result) {
            console.log(result);
        });
    };


    $(function () {
        initCategory();
    });
});