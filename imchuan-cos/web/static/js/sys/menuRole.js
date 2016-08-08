define([
    'jquery',
    'cargo2',
    'lte',
    'zTree',
    'common/main'
], function ($, cargo2) {
    var roleId = '',
        currentMenuStatus = true;

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
            refreshTreeMenu();
        }

        $.fn.zTree.init($('#treeRole'), setting);

    };

    var initTreeMenu = function () {
        var setting = {
            data: {
                simple: true
            },
            check: {
                enable: true
            },
            async: {
                enable: true,
                url: window.ctx + '/sys/role/roleMenus',
                contentType: 'application/json',
                type: 'get',
                dataType: 'json',
                otherParam: ['roleId', function () {
                    return roleId;
                }]
            },
            view: {
                dblClickExpand: false
            },
            callback: {
                onAsyncSuccess: function () {
                    disabledTreeMenu();
                }
            }
        };

        $.fn.zTree.init($('#treeMenu'), setting);
    };


    /**
     * 启用/禁用 菜单
     * @param disabled
     */
    var disabledTreeMenu = function () {
        var treeObj = $.fn.zTree.getZTreeObj('treeMenu');
        var nodes = treeObj.getNodes();
        $.each(nodes, function () {
            treeObj.setChkDisabled(this, currentMenuStatus, true, true);
        });
    };

    /**
     * 刷新菜单树
     */
    var refreshTreeMenu = function () {
        var treeObj = $.fn.zTree.getZTreeObj('treeMenu');
        treeObj.reAsyncChildNodes(null, 'refresh');
    };

    /**
     * 修改
     */
    var update = function () {
        if (cargo2.isBlank(roleId)) {
            layer.msg('请选择角色');
            return;
        }
        if (currentMenuStatus) {
            $(this).html('取消');
            $('#btnSave').attr('disabled', false);
            currentMenuStatus = false;
        } else {
            $(this).html('修改');
            $('#btnSave').attr('disabled', true);
            currentMenuStatus = true;
            refreshTreeMenu();
        }
        disabledTreeMenu();
    };
    /**
     * 保存
     */
    var save = function () {
        var treeObj = $.fn.zTree.getZTreeObj('treeMenu');
        var nodes = treeObj.getCheckedNodes(true);
        var ids = [];
        if (nodes && nodes.length > 0) {
            ids = cargo2.extractToArray(nodes, 'id');
        }
        $.ajax({
            type: 'POST',
            url: window.ctx + '/sys/role/saveRoleMenu/' + roleId,
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(ids),
            success: function (result) {
                if (result.status === '0') {
                    layer.msg('保存成功');
                    refreshTreeMenu();
                }
            }
        });
    };


    var bindEvents = function () {
        $('#btnUpdate').bind('click', update);
        $('#btnSave').bind('click', save);
    };

    $(function () {
        initTreeRole();
        initTreeMenu();
        bindEvents();
    });
});