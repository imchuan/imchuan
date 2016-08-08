<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <%@include file="common/static.jsp" %>
    <title>木川个人博客-后台管理</title>
    <script src="${path}/static/libs/requirejs/require.js" data-main="index.js"></script>
</head>
<body class="hold-transition lockscreen">
<!-- Automatic element centering -->
<div class="lockscreen-wrapper">
    <div class="lockscreen-logo">
        木川个人博客
    </div>
    <!-- User name -->
    <div class="lockscreen-name">John Doe</div>
    <!-- START LOCK SCREEN ITEM -->
    <div class="lockscreen-item">
        <!-- lockscreen image -->
        <div class="lockscreen-image">
            <img src="${path}/static/libs/lte/img/user1-128x128.jpg">
        </div>
        <!-- /.lockscreen-image -->

        <!-- lockscreen credentials (contains the form) -->
        <form class="lockscreen-credentials">
            <div class="input-group">
                <input type="password" class="form-control" placeholder="登陆密码">

                <div class="input-group-btn">
                    <button class="btn"><i class="fa fa-arrow-right text-muted"></i></button>
                </div>
            </div>
        </form><!-- /.lockscreen credentials -->

    </div><!-- /.lockscreen-item -->
    <div class="text-center">
        <a href="${path}/login">使用其他账号登陆</a>
    </div>
</div><!-- /.center -->
</body>
</html>
