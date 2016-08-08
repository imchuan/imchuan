<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <%@include file="../common/static.jsp" %>
    <title>菜单权限管理</title>
    <link rel="stylesheet" href="${path}/static/libs/zTree_v3/css/metroStyle/metroStyle.css">
    <script src="${path}/static/libs/requirejs/require.js" data-main="sys/menuRole.js"></script>
</head>
<body class="hold-transition skin-blue sidebar-mini">
<div class="wrapper">
    <%@include file="../common/header.jsp" %>
    <!-- Left side column. contains the logo and sidebar -->
    <%@include file="../common/menu.jsp" %>

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
        <section class="content-header">
            <ol class="breadcrumb">
                <li><a href="${path}/"><i class="fa fa-dashboard"></i>首页</a></li>
                <li class="active">菜单权限管理</li>
            </ol>
        </section>
        <!-- Main content -->
        <section class="content">
            <div class="row">
                <div class="col-md-6">
                    <div class="box box-primary" style="height:480px;">
                        <div class="box-header">
                            <i class="ion ion-clipboard"></i>

                            <h3 class="box-title">角色</h3>
                        </div>
                        <div class="box-body">
                            <ul id="treeRole" class="ztree"></ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="box box-primary" style="height:480px;">
                        <div class="box-header">
                            <i class="ion ion-clipboard"></i>

                            <h3 class="box-title">菜单</h3>
                            <button class="btn btn-default pull-right" type="button" id="btnUpdate">修改</button>
                            <button class="btn btn-primary pull-right" type="button" id="btnSave" disabled>保存</button>
                        </div>
                        <div class="box-body">
                            <ul id="treeMenu" class="ztree"></ul>
                        </div>
                    </div>
                </div>
            </div>

        </section>
        <!-- /.content -->
    </div>
    <%@include file="../common/footer.jsp" %>
</div>
</body>
</html>
