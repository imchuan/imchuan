<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!--头部-->
<header class="main-header">
    <!-- Logo -->
    <a href="${path}/" class="logo">
        <!-- mini logo for sidebar mini 50x50 pixels -->
        <span class="logo-mini">木</span>
        <!-- logo for regular state and mobile devices -->
        <span class="logo-lg"><b>木</b>川</span>
    </a>
    <!-- Header Navbar: style can be found in header.less -->
    <nav class="navbar navbar-static-top" role="navigation">
        <!-- Sidebar toggle button-->
        <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
            <span class="sr-only">Toggle navigation</span>
        </a>

        <div class="navbar-custom-menu">
            <ul class="nav navbar-nav">
                <!--用户通知-->
                <li class="dropdown notifications-menu">
                    <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
                        <i class="fa fa-bell-o"></i>
                        <span class="label label-warning">10</span>
                    </a>
                    <ul class="dropdown-menu">
                        <li class="header">你有2条未读消息</li>
                        <li>
                            <!-- inner menu: contains the actual data -->
                            <ul class="menu">
                                <li>
                                    <a href="#">
                                        <i class="fa fa-users text-aqua"></i>您有2条订单未处理
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i class="fa fa-warning text-yellow"></i>您有1个货物未发送
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li class="footer"><a href="#">查看所有</a></li>
                    </ul>
                </li>
                <li class="dropdown user user-menu">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <%--<img src="${path}/libs/lte/img/avatar2.png" class="user-image">--%>
                        <img src="${path}/static/libs/lte/img/avatar5.png" class="user-image">
                        <span class="hidden-xs"><sec:authentication property="principal.username"/></span>
                    </a>
                    <ul class="dropdown-menu">
                        <!-- User image -->
                        <%--<li class="user-header">
                            <img src="${path}/libs/lte/img/user2-160x160.jpg" class="img-circle" alt="User Image">

                            <p>
                                管理员
                            </p>
                        </li>--%>
                        <!-- Menu Body -->
                        <%--<li class="user-body">
                            <div class="col-xs-4 text-center">
                                <a href="#">Followers</a>
                            </div>
                            <div class="col-xs-4 text-center">
                                <a href="#">Sales</a>
                            </div>
                            <div class="col-xs-4 text-center">
                                <a href="#">Friends</a>
                            </div>
                        </li>--%>
                        <!-- Menu Footer-->
                        <li class="user-footer">
                            <%--<div class="pull-left">
                                <a href="#" class="btn btn-default btn-flat">Profile</a>
                            </div>--%>
                            <div class="pull-right">
                                <form:form action="${path}/logout" method="post">
                                    <button type="submit" class="btn btn-default btn-flat">退出</button>
                                </form:form>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
</header>
