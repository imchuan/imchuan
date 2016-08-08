define([
    'jquery'
], function ($) {
    /**
     * 绑定超链接点击事件
     */
    var bindMenuClick = function () {
        $('.sidebar-menu .treeview-menu').find('a').each(function () {
            $(this).click(function () {
                window.sessionStorage.setItem('CURRENT_MENU', $(this).attr('href'));
            });
        });
    };

    /**
     * 初始化菜单选中状态
     */
    var initMenuStatus = function () {
        var pathname = window.location.pathname;
        $('.sidebar-menu .treeview-menu').find('a').each(function () {
            if (pathname.indexOf($(this).attr('href')) != -1) {
                $(this).parent().addClass('active').siblings().removeClass('active');
                $(this).parents('.treeview-menu').parent().addClass('active').siblings().removeClass('active');
            }
        });
    };

    $(function () {
        bindMenuClick();
        initMenuStatus();
    });
});