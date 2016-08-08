<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <%@include file="common/static.jsp" %>
    <title>木川博客管理系统-登陆</title>
    <%--<script src="${path}/static/libs/requirejs/require.js" data-main="login.js"></script>--%>
</head>
<body class="hold-transition login-page">
<div class="login-box">
    <div class="login-logo">
        木川博客管理系统
    </div>
    <!-- /.login-logo -->
    <div class="login-box-body">

        <c:if test="${not empty e}">
            <p class="login-box-msg" style="color: orangered;">用户名或密码不正确。</p>
        </c:if>

        <form:form action="${path}/authentication" method="post" autocomplete="off">
            <div class="form-group has-feedback">
                <input type="text" class="form-control" placeholder="用户名" name="userName">
                <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
            </div>
            <div class="form-group has-feedback">
                <input type="password" class="form-control" placeholder="密码" name="password">
                <span class="glyphicon glyphicon-lock form-control-feedback"></span>
            </div>
            <div class="row">
                <div class="col-xs-8">
                    <div class="checkbox icheck">
                        <label>
                            <input type="checkbox" name="rememberMe" id="rememberMe" checked/> 记住密码
                        </label>
                    </div>
                </div>
                <!-- /.col -->
                <div class="col-xs-4">
                    <button type="submit" class="btn btn-primary btn-block btn-flat">登陆</button>
                </div>
                <!-- /.col -->
            </div>
        </form:form>
    </div>
    <!-- /.login-box-body -->
</div>
<!-- /.login-box -->
</body>
</html>
