// 1.为页面上所有基于JQ的ajax请求发送之前,对参数对象作处理
$.ajaxPrefilter(function (ajaxOpt) {
    console.log(ajaxOpt);
    ajaxOpt.url = 'http://ajax.frontend.itheima.net' + ajaxOpt.url;
});
