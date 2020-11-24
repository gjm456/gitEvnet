// 1.为页面上所有基于JQ的ajax请求发送之前,对参数对象作处理
$.ajaxPrefilter(function (ajaxOpt) {
    console.log(ajaxOpt);
    ajaxOpt.url = 'http://ajax.frontend.itheima.net' + ajaxOpt.url;

    //2 统一为有权限的接口 设置headers接口 或者说 为所有/my/请求 添加 token
    if (ajaxOpt.url.indexOf('/my/') > -1) {
        ajaxOpt.headers = {
            Authorization: localStorage.getItem('token')
        }
    }
    // 3.为所有的ajax请求 统一 配置complete 事件函数
    ajaxOpt.complete = function (res) {
        console.log('complete');
        if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
            layer.msg(res.responseJSON.message, {
                icon: 1,
                time: 1500
            }, function () {
                localStorage.removeItem('token');
                location.href = '/login.html';
            })
        }
        console.log(res.responseJSON);
    }

});
