define([
    'jquery',
    'cargo2',
    'common/resource',
    'lte',
    'zTree',
    'common/main'
], function ($, cargo2, Resource) {
    var resource = new Resource('/cms/category');
    var currentTreeNode;
    var setting = {
        data: {
            simple: true
        },
        async: {
            enable: true,
            url: window.ctx + '/cms/category/tree',
            contentType: 'application/json',
            type: 'get',
            dataType: 'json',
            dataFilter: filter
        },
        view: {
            dblClickExpand: false
        },
        callback: {
            onClick: showDetail
        }
    };

    function filter(treeId, parentNode, childNodes) {
        if (!childNodes) return null;
        for (var i = 0, l = childNodes.length; i < l; i++) {
            childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
        }
        return childNodes;
    }

    function showDetail(event, treeId, treeNode) {
        currentTreeNode = treeNode;

        $('#id').val(currentTreeNode.id);
        $('#parentId').val(currentTreeNode.parentId);
        $('#parentName').val(currentTreeNode.parentName);
        $('#name').val(currentTreeNode.name);
        $('#code').val(currentTreeNode.code);
        $('#queue').val(currentTreeNode.queue);
        $('#url').val(currentTreeNode.link);
        $('#remark').val(currentTreeNode.remark);
        return false;
    }

    var refreshTree = function () {
        var treeObj = $.fn.zTree.getZTreeObj('treeMenu');
        treeObj.reAsyncChildNodes(null, 'refresh');
    };

    var clearForm = function () {
        $('#menuForm :input').each(function () {
            $(this).val('');
        });
    };
    var add = function () {
        clearForm();
        if (currentTreeNode) {
            $('#parentId').val(currentTreeNode.id);
            $('#parentName').val(currentTreeNode.name);
        }
    };

    var save = function () {
        var formData = $('#menuForm').serializeJson();
        resource.save(formData, function (obj) {
            clearForm();
            refreshTree();
            layer.msg('操作成功');
        }, function (result) {
            layer.msg(result.info);
        });
    };

    var remove = function () {
        var id = $('#id').val();
        if (id) {
            clearForm();
            resource.delete(id, function () {
                refreshTree();
                layer.msg('操作成功');
            }, function (result) {
                layer.msg(result.info);
            });
        } else {
            layer.msg('请选择要删除的菜单');
        }

    };

    var initTree = function () {
        $.fn.zTree.init($('#treeMenu'), setting);
    };

    var bindEvents = function () {
        $('#btnNew').click(function () {
            add();
        });
        $('#btnSave').click(function () {
            save();
        });

        $('#btnDelete').click(function () {
            remove();
        });

    };

    $(function () {
        initTree();
        bindEvents();
    });
});