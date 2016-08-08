<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <%@include file="../common/static.jsp" %>
    <title>角色管理</title>
    <script src="${path}/static/libs/requirejs/require.js" data-main="sys/sysRoleList.js"></script>
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
                <li class="active">角色管理</li>
            </ol>
        </section>
        <!-- Main content -->
        <section class="content">
            <div class="box box-primary">
                <div class="box-body">
                    <table class="table table-striped" id="table">

                    </table>
                </div>

                <div class="box-footer clearfix no-border">
                    <a href="${path}/sys/role/edit" class="btn btn-primary pull-left" id="btnNew">新增</a>
                    <button class="btn btn-default pull-left" id="btnEdit">编辑</button>
                    <button class="btn btn-default pull-left" id="btnDelete">删除</button>
                </div>
            </div>


        </section>
        <!-- /.content -->
    </div>
    <%@include file="../common/footer.jsp" %>
</div>
</body>
</html>
