<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <%@include file="../common/static.jsp" %>
    <title>资源权限管理</title>
    <link rel="stylesheet" href="${path}/static/libs/zTree_v3/css/metroStyle/metroStyle.css">
    <script src="${path}/static/libs/requirejs/require.js" data-main="sys/resourceRole.js"></script>
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
                <li class="active">资源权限管理</li>
            </ol>
        </section>
        <!-- Main content -->
        <section class="content">
            <div class="row">
                <div class="col-md-4">
                    <div class="box box-primary">
                        <div class="box-header">
                            <i class="ion ion-clipboard"></i>

                            <h3 class="box-title">角色</h3>
                        </div>
                        <div class="box-body">
                            <ul id="treeRole" class="ztree"></ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="box box-primary">
                        <div class="box-header">
                            <i class="ion ion-clipboard"></i>

                            <h3 class="box-title">资源</h3>
                        </div>
                        <div class="box-body">
                            <form class="form-inline margin-bottom" id="form">
                                <div class="form-group">
                                    <div class="input-group">
                                        <span class="input-group-addon">资源名称</span>
                                        <input type="text" class="form-control" id="name" name="name">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="input-group">
                                        <span class="input-group-addon">资源路径</span>
                                        <input type="text" class="form-control" id="url" name="url">
                                    </div>
                                </div>
                                <div class="form-group pull-right">
                                    <button class="btn btn-default pull-left" type="button" id="btnSearch">查询</button>
                                    <button class="btn btn-default pull-left" type="button" id="btnSave">保存</button>
                                </div>
                            </form>
                            <table class="table-striped" id="table">

                            </table>
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
