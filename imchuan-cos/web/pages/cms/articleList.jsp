<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <%@include file="../common/static.jsp" %>
    <title>文章管理</title>
    <script src="${path}/static/libs/requirejs/require.js" data-main="cms/articleList.js"></script>
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
                <li class="active">文章管理</li>
            </ol>
        </section>
        <!-- Main content -->
        <section class="content">
            <div class="box box-primary">

                <div class="box-body">
                    <form class="form-inline" id="form">
                        <div class="form-group">
                            <label for="title">标题</label>
                            <input type="text" class="form-control" id="title" name="title">
                        </div>
                        <div class="form-group">
                            <label for="articleNo">编号</label>
                            <input type="text" class="form-control" style="width: 100px;" id="articleNo" name="articleNo">
                        </div>
                        <div class="form-group">
                            <label for="selCategory">栏目</label>
                            <select id="selCategory" class="form-control" style="width: 200px;"></select>
                        </div>
                        <div class="form-group">
                            <label for="selTags">标签</label>
                            <select id="selTags" class="form-control" style="width: 200px;"></select>
                        </div>
                        <div class="form-group">
                            <label for="isTop">是否置顶</label>

                            <div class="checkbox">
                                <input type="checkbox" id="isTop" name="isTop" value="1">
                            </div>
                        </div>
                    </form>
                    <div class="row" style="margin-top: 5px;padding-right: 10px;">
                        <button class="btn btn-default pull-right" type="button" id="btnSoldOut">下架</button>
                        <button class="btn btn-default pull-right" type="button" id="btnPutAway">上架</button>
                        <button class="btn btn-default pull-right" type="button" id="btnTop">置顶</button>
                        <button class="btn btn-default pull-right" type="button" id="btnPreview">预览</button>
                        <button class="btn btn-default pull-right" type="button" id="btnRest">重置</button>
                        <button class="btn btn-default pull-right" id="btnEdit">编辑</button>
                        <a href="${path}/cms/article/edit" class="btn btn-default pull-right" id="btnNew">新增</a>
                        <button class="btn btn-default pull-right" type="button" id="btnSearch">查询</button>
                    </div>

                </div>

            </div>

            <div class="box box-primary">
                <div class="box-body">
                    <table class="table" id="table">

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
