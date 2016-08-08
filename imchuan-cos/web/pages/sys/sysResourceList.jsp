<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <%@include file="../common/static.jsp" %>
    <title>资源管理</title>
    <script src="${path}/static/libs/requirejs/require.js" data-main="sys/sysResourceList.js"></script>
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
                <li class="active">资源管理</li>
            </ol>
        </section>
        <!-- Main content -->
        <section class="content">
            <div class="box box-primary">
                <div class="box-header with-border">
                    <form class="form-inline" id="form">
                        <div class="form-group">
                            <div class="input-group">
                                <span class="input-group-addon">资源名称</span>
                                <input type="hidden" id="entityId" name="id"/>
                                <input type="text" class="form-control" id="name" name="name">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="input-group">
                                <span class="input-group-addon">资源路径</span>
                                <input type="text" class="form-control" id="url" name="url">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="input-group">
                                <span class="input-group-addon">说明</span>
                                <input type="text" class="form-control" id="remark" name="remark">
                            </div>
                        </div>
                        <div class="form-group pull-right">
                            <button class="btn btn-default pull-left" type="button" id="btnSearch">查询</button>
                            <button class="btn btn-default pull-left" type="button" id="btnNew">新增</button>
                            <button class="btn btn-default pull-left" type="button" id="btnSave">保存</button>
                            <button class="btn btn-default pull-left" type="button" id="btnCancel">取消</button>
                            <button class="btn btn-default pull-left" type="button" id="btnDelete">删除</button>
                            <%--<button class="btn btn-default pull-left" type="button" id="btnClear">清空</button>--%>
                        </div>
                    </form>
                </div>
                <div class="box-body">
                    <table class="table-striped" id="table">

                    </table>
                </div>
            </div>


        </section>
        <!-- /.content -->
    </div>
    <%@include file="../common/footer.jsp" %>
</div>
</body>
</html>
