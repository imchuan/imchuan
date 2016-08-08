<%@ page import="com.imchuan.api.pojo.TreeNode" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%
    final TreeNode treeNode = (TreeNode) session.getAttribute("USER_MENUS");
    if (null != treeNode) {
        request.setAttribute("menus", treeNode.getChildren());
    }
%>

<!--左侧菜单-->
<aside class="main-sidebar">
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">
        <!-- sidebar menu: : style can be found in sidebar.less -->
        <ul class="sidebar-menu">

            <li class="header">主菜单</li>

            <c:set var="menuList" value="${menus}"/>
            <c:forEach var="menuItem" items="${menuList}" varStatus="status">

                <li class="treeview">
                    <a href="#">
                        <i class="fa fa-book"></i><span><c:out value="${menuItem.name}"/></span>
                        <i class="fa fa-angle-left pull-right"></i>
                    </a>
                    <ul class="treeview-menu">
                        <c:forEach var="menuChild" items="${menuItem.children}">
                            <li><a href="<c:url value="${menuChild.link}"/>"><i
                                    class="fa"></i>${menuChild.name}</a></li>
                        </c:forEach>
                    </ul>
                </li>
            </c:forEach>
        </ul>
    </section>
    <!-- /.sidebar -->
</aside>