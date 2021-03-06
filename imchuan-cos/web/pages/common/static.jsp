<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ include file="config.jsp" %>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<!-- CSRF -->
<meta name="_csrf" content="${_csrf.token}"/>
<!-- default header name is X-CSRF-TOKEN -->
<meta name="_csrf_header" content="${_csrf.headerName}"/>
<!-- Tell the browser to be responsive to screen width -->
<meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
<!-- Bootstrap 3.3.5 -->
<link rel="stylesheet" href="${path}/static/libs/bootstrap/css/bootstrap.min.css">
<!-- Font Awesome -->
<link rel="stylesheet" href="${path}/static/libs/font-awesome/css/font-awesome.min.css">
<!-- Ionicons -->
<link rel="stylesheet" href="${path}/static/libs/ionicons/css/ionicons.min.css">
<link rel="stylesheet" href="${path}/static/libs/select2/select2.min.css">
<!-- Theme style -->
<link rel="stylesheet" href="${path}/static/libs/lte/css/lte.css">
<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
<script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->

<!-- 公共js 配置-->
<script>
    var ctx, require;
    /**
     * 项目根路径
     */
    ctx = '${path}';
    /**
     * require js 的一些配置
     */
    require = {
        baseUrl: ctx + '/static/js',
        paths: {
            'jquery': ctx + '/static/libs/jquery/jquery-2.1.4',
            'bootstrap': ctx + '/static/libs/bootstrap/js/bootstrap',
            'lte': ctx + '/static/libs/lte/js/lte',
            'cargo2': ctx + '/static/libs/cargo2/js/cargo2',
            'jquery-ui': ctx + '/static/libs/jquery-ui/jquery-ui',
            'zTree': ctx + '/static/libs/zTree_v3/js/jquery.ztree.all-3.5',
            'blob': ctx + '/static/libs/fileupload/js/canvas-to-blob',
            'fileupload': ctx + '/static/libs/fileupload/js/fileinput',
            'kindeditor': ctx + '/static/libs/kindeditor/kindeditor',
            'kindeditor-cn': ctx + '/static/libs/kindeditor/lang/zh_CN',
            'select2': ctx + '/static/libs/select2/select2.full'
        },
        shim: {
            'lte': {
                exports: 'lte',
                deps: ['bootstrap']
            },
            'bootstrap': {
                exports: 'bootstrap',
                deps: ['jquery']
            },
            'cargo2': {
                exports: 'cargo2',
                deps: ['jquery']
            },
            'jquery-ui': {
                exports: 'jquery-ui',
                deps: ['jquery']
            },
            'zTree': {
                exports: 'zTree',
                deps: ['jquery']
            },
            'fileupload': {
                exports: 'fileupload',
                deps: ['jquery', 'bootstrap', 'blob']
            },
            'kindeditor': {
                exports: 'kindeditor',
                deps: ['jquery']
            },
            'kindeditor-cn': {
                exports: 'kindeditor-cn',
                deps: ['kindeditor']
            },
            'select2': {
                deps: ['jquery']
            }
        },
        desp: ['common/main']
    };
</script>