<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <%@include file="../common/static.jsp" %>
    <title>编辑角色</title>
    <script src="${path}/static/libs/requirejs/require.js" data-main="sys/sysRoleEdit.js"></script>
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
                <li><a href="${path}/sys/role/list">角色管理</a></li>
                <li class="active">角色编辑</li>
            </ol>
        </section>
        <!-- Main content -->
        <section class="content">
            <div class="box box-primary">
                <!-- form start -->
                <form class="form-horizontal" id="form">
                    <div class="box-body">
                        <div class="form-group">
                            <label for="code" class="col-sm-1 control-label">角色代码</label>

                            <div class="col-sm-2">
                                <input type="hidden" id="id" name="id" value="${item.id}"/>
                                <input type="text" class="form-control" id="code" name="code" placeholder="角色代码"
                                       value="${item.code}">
                            </div>
                        </div>
                        <div class="form-group" id="divPassword">
                            <label for="name" class="col-sm-1 control-label">角色名称</label>

                            <div class="col-sm-2">
                                <input type="text" class="form-control" id="name" name="name"
                                       placeholder="角色名称" value="${item.name}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="remark" class="col-sm-1 control-label">备注</label>

                            <div class="col-sm-5">
                                <textarea class="form-control" id="remark" name="remark"
                                          placeholder="备注">${item.remark}</textarea>
                            </div>
                        </div>
                    </div>
                    <!-- /.box-body -->
                    <div class="box-footer">
                        <button type="button" class="btn btn-primary" id="btnSave">保存</button>
                        <a href="${path}/sys/role/edit" class="btn btn-default">新增</a>
                        <a href="${path}/sys/role/list" class="btn btn-default">取消</a>

                    </div>
                    <!-- /.box-footer -->
                </form>
            </div>

        </section>
        <!-- /.content -->
    </div>
    <%@include file="../common/footer.jsp" %>
</div>
</body>
</html>
