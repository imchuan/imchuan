define([
    'jquery',
    'cargo2',
    'lte',
    'zTree'
], function ($, cargo2) {
    var uid = $('#uid').val();
    var index = parent.layer.getFrameIndex(window.name); //获取窗口索引

    var setting = {
        data: {
            simple: true
        },
        check: {
            enable: true
        },
        async: {
            enable: true,
            url: window.ctx + '/sys/user/getUserRole/' + uid,
            contentType: 'application/json',
            type: 'get',
            dataType: 'json',
            dataFilter: filter
        },
        view: {
            dblClickExpand: false
        }
    };

    function filter(treeId, parentNode, childNodes) {
        if (!childNodes) return null;
        for (var i = 0, l = childNodes.length; i < l; i++) {
            childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
        }
        return childNodes;
    }

    var save = function () {
        var treeObj = $.fn.zTree.getZTreeObj('treeRole');
        var nodes = treeObj.getCheckedNodes(true);
        var roleIds = [];
        if (nodes && nodes.length > 0) {
            roleIds = cargo2.extractToArray(nodes, 'id');
        }
        $.ajax({
            type: 'POST',
            url: window.ctx + '/sys/user/saveUserRole/' + uid,
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(roleIds),
            success: function (result) {
                if (result.status === '0') {
                    parent.$('#table').bootstrapTable('refresh');
                    parent.layer.close(index);
                    parent.layer.msg('保存成功');
                }
            }
        });


    };

    var bindEvents = function () {
        $('#btnSave').click(function () {
            save();
        });
    };

    $(function () {
        $.fn.zTree.init($('#treeRole'), setting);
        bindEvents();
    });
});