<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <%@include file="common/static.jsp" %>
    <title>木川个人博客-后台管理</title>
    <script src="${path}/static/libs/requirejs/require.js" data-main="index.js"></script>
</head>
<body class="hold-transition skin-blue sidebar-mini">
<div class="wrapper">
    <%@include file="common/header.jsp" %>
    <!-- Left side column. contains the logo and sidebar -->
    <%@include file="common/menu.jsp" %>

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
        <%@include file="common/crumbs.jsp" %>
        <!-- Main content -->
        <section class="content">
        <sec:authorize access="isRememberMe()">
            remember
        </sec:authorize>

        </section>
        <!-- /.content -->
    </div>
    <%@include file="common/footer.jsp" %>
</div>
</body>
</html>
