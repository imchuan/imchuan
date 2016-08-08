<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <%@include file="../common/static.jsp" %>
    <title>用户角色</title>
    <link rel="stylesheet" href="${path}/static/libs/zTree_v3/css/metroStyle/metroStyle.css">
    <script src="${path}/static/libs/requirejs/require.js" data-main="sys/userRole.js"></script>
</head>
<body>
<div class="box box-primary">
    <div class="box-header">
        选中/取消 后点击保存按钮即可更新用户的角色信息
    </div>
    <div class="box-body">
        <ul id="treeRole" class="ztree"></ul>
    </div>
    <div class="box-footer clearfix">
        <input type="hidden" id="uid" value="${uid}"/>
        <button class="btn btn-primary pull-right" id="btnSave" type="button">保存</button>
    </div>
</div>
</body>
</html>
