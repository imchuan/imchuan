<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <%@include file="../common/static.jsp" %>
    <title>栏目管理</title>
    <link rel="stylesheet" href="${path}/static/libs/zTree_v3/css/metroStyle/metroStyle.css">
    <script src="${path}/static/libs/requirejs/require.js" data-main="cms/categoryList.js"></script>
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
                <li class="active">栏目管理</li>
            </ol>
        </section>
        <!-- Main content -->
        <section class="content">
            <div class="row">
                <div class="col-md-6">
                    <div class="box box-primary">
                        <div class="box-header">
                            <i class="ion ion-clipboard"></i>

                            <h3 class="box-title">栏目</h3>
                            <button class="btn btn-default pull-right" id="btnNew">添加</button>
                        </div>
                        <!-- /.box-header -->
                        <div class="box-body">
                            <ul id="treeMenu" class="ztree"></ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="box box-primary">
                        <div class="box-header">
                            <i class="ion ion-clipboard"></i>

                            <h3 class="box-title">栏目明细</h3>
                        </div>
                        <!-- /.box-header -->
                        <form class="form-horizontal" id="menuForm">
                            <div class="box-body">
                                <div class="form-group">
                                    <label for="name" class="col-sm-2 control-label">父级栏目</label>

                                    <div class="col-sm-4">
                                        <input type="hidden" id="id" name="id"/>
                                        <input type="hidden" id="parentId" name="parentId"/>
                                        <input type="text" class="form-control" id="parentName" name="parentName" readonly>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="name" class="col-sm-2 control-label">栏目名称</label>

                                    <div class="col-sm-4">
                                        <input type="text" class="form-control" id="name" name="name"
                                               placeholder="栏目名称">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="code" class="col-sm-2 control-label">栏目编码</label>

                                    <div class="col-sm-4">
                                        <input type="text" class="form-control" id="code" name="code"
                                               placeholder="栏目编码">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="url" class="col-sm-2 control-label">栏目路径</label>

                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" id="url" name="url"
                                               placeholder="栏目路径">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="queue" class="col-sm-2 control-label">排序</label>

                                    <div class="col-sm-4">
                                        <input type="text" class="form-control" id="queue" name="queue"
                                               placeholder="排序">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="remark" class="col-sm-2 control-label">说明</label>

                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" id="remark" name="remark"
                                               placeholder="说明">
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div class="box-footer clearfix no-border" id="btnGroups">
                            <button class="btn btn-default pull-right" id="btnDelete">删除</button>
                            <button class="btn btn-primary pull-right" id="btnSave" type="button">保存</button>
                        </div>
                    </div>
                </div>
            </div>

        </section>
        <!-- /.content -->
    </div>
    <%@include file="../common/footer.jsp" %>
</div>
</body>
</html>
