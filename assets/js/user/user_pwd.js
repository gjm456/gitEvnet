


$(function () {
    // 1.添加表单验证 
    layui.form.verify({
        // 1.1密码规则
        pwd: [/^\S{6,12}$/, '昵称必须在6-16位之间'],
        // 1.2新旧密码必须不一样规则
        samepwd: function (value) {
            if (value == $('[name=oldname]').val()) {
                return '新密码与旧密码不能一致哟~';
            }
        },
        // 1.3确认面 必须和新密码一致 规则
        confirmpwd: function (value) {
            if (value == $('[name=newpwd]'), val()) {
                return '确认密码和新密码输入不一样哟~~';
            }
        }

    });
    // 2.为 表单添加提交事件

    $('.layui-form').on('submit', changePwd);


})

// 1.修改密码
function changePwd(e) {

    e.preventDefault();

    // a.提交数据到接口，完成更新密码
    $.ajax({
        url: '/my/updatepwd',
        method: 'POST',
        data: $(this).serialize(),
        success(res) {

            //b. 如果不成功，则退出函数
            if (res.status != 0) return layui.layer.msg(res.message);

            // c.如果成功，则清空token并 跳转到login.html
            layui.layer.msg(res.message, {
                icon: 1,
                time: 1500
            }, function () {
                localStorage.removeItem('token');
                window.top.location = '/login.html';
            });

        }

    });
    // alert('校验通过啦~~');
}