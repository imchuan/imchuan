<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <%@include file="../common/static.jsp" %>
    <title>文章内容编辑</title>
    <script src="${path}/static/libs/requirejs/require.js" data-main="cms/articleEdit.js"></script>
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
                <li><a href="${path}/cms/article/list">文章管理</a></li>
                <li class="active">文章编辑</li>
                <li><span class="label label-primary">NO:${item.articleNo}</span></li>
            </ol>
        </section>
        <!-- Main content -->
        <section class="content">

            <form class="form-horizontal" id="form">

                <div class="nav-tabs-custom">
                    <ul class="nav nav-tabs">
                        <li class="active"><a href="#tab_1" data-toggle="tab">基本信息</a></li>
                        <li><a href="#tab_2" data-toggle="tab">文章内容</a></li>
                        <li class="pull-right">
                            <c:if test="${item.status != 'RELEASED'}">
                                <button type="button" class="btn btn-primary pull-right" id="btnSave">保存草稿</button>
                                <button type="button" class="btn btn-primary pull-right" id="btnSaveAndPutAway">保存并上架</button>
                            </c:if>
                            <c:if test="${item.status == 'RELEASED'}">
                                <span class="label label-success">已上架，上架时间: ${item.publishTime}</span>
                                <button type="button" class="btn btn-primary pull-right" id="btnSoldOut">下架</button>
                            </c:if>
                        </li>
                    </ul>
                    <div class="tab-content">
                        <div class="tab-pane active" id="tab_1">
                            <input type="hidden" id="id" name="id" value="${item.id}"/>
                            <input type="hidden" id="status" value="${item.status}">

                            <div class="form-group">
                                <label class="col-sm-2 control-label">所属栏目<i class="fa fa-asterisk text-red text-sm"></i></label>
                                <input type="hidden" id="categoryIds" name="categoryIds" value="${item.categoryIds}">

                                <div class="col-sm-4">
                                    <select class="form-control" id="selCategory" style="width: 100%;">
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="title" class="col-sm-2 control-label">标题<i class="fa fa-asterisk text-red text-sm"></i></label>

                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="title" name="title"
                                           placeholder="标题" value="${item.title}">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="intro" class="col-sm-2 control-label">简介</label>

                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="intro" name="intro"
                                           placeholder="简介" value="${item.intro}">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="pageTitle" class="col-sm-2 control-label">页面标题</label>

                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="pageTitle" name="pageTitle"
                                           placeholder="页面标题" value="${item.pageTitle}">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="keywords" class="col-sm-2 control-label">页面关键字</label>

                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="keywords" name="keywords"
                                           placeholder="页面关键字" value="${item.keywords}">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="description" class="col-sm-2 control-label">页面描述</label>

                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="description" name="description"
                                           placeholder="页面描述" value="${item.description}">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">标签</label>
                                <input type="hidden" id="tags" name="tags" value="${item.tags}">

                                <div class="col-sm-4">
                                    <select class="form-control" id="selTags" style="width: 100%;"></select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">是否置顶</label>

                                <div class="col-sm-4" style="margin-top: 5px;">
                                    <input type="hidden" name="isTop" id="isTop" value="${item.isTop}">
                                    <input type="checkbox" id="cbxIsTop" value="1"/>
                                </div>
                            </div>
                        </div><!-- /.tab-pane -->
                        <div class="tab-pane" id="tab_2">
                            <textarea name="content" id="txtContent">${item.content}</textarea>
                        </div><!-- /.tab-pane -->
                    </div><!-- /.tab-content -->
                </div>
            </form>
        </section>
        <!-- /.content -->
    </div>
    <%@include file="../common/footer.jsp" %>
</div>
</body>
</html>
