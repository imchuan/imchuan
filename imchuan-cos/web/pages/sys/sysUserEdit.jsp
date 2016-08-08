<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <%@include file="../common/static.jsp" %>
    <title>用户管理</title>
    <script src="${path}/static/libs/requirejs/require.js" data-main="sys/sysUserEdit.js"></script>
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
                <li><a href="${path}/sys/user/list">用户管理</a></li>
                <li class="active">用户编辑</li>
            </ol>
        </section>
        <!-- Main content -->
        <section class="content">
            <div class="box box-primary">
                <!-- form start -->
                <form class="form-horizontal" id="form">
                    <div class="box-body">
                        <div class="form-group">
                            <label for="userName" class="col-sm-1 control-label">用户名</label>

                            <div class="col-sm-2">
                                <input type="hidden" id="id" name="id" value="${item.id}"/>
                                <input type="text" class="form-control" id="userName" name="userName" placeholder="用户名"
                                       value="${item.userName}">
                            </div>
                        </div>
                        <c:if test="${empty item.id}">
                            <div class="form-group">
                                <label for="password" class="col-sm-1 control-label">密码</label>

                                <div class="col-sm-2">
                                    <input type="password" class="form-control" id="password" name="password"
                                           placeholder="密码" value="${item.password}">
                                </div>
                            </div>
                        </c:if>
                        <div class="form-group">
                            <label for="nickName" class="col-sm-1 control-label">昵称</label>

                            <div class="col-sm-2">
                                <input type="text" class="form-control" id="nickName" name="nickName" placeholder="昵称"
                                       value="${item.nickName}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="email" class="col-sm-1 control-label">邮箱地址</label>

                            <div class="col-sm-2">
                                <input type="text" class="form-control" id="email" name="email"
                                       placeholder="邮箱地址" value="${item.email}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="mobile" class="col-sm-1 control-label">手机号</label>

                            <div class="col-sm-2">
                                <input type="text" class="form-control" id="mobile" name="mobile"
                                       placeholder="手机号" value="${item.mobile}">
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
                        <a href="${path}/sys/user/edit" class="btn btn-default">新增</a>
                        <a href="${path}/sys/user/list" class="btn btn-default">取消</a>

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
