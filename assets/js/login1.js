$(function () {
    // 注册按钮点击事件
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });

    //1. 登录按钮点击事件
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    //2.为layui添加 登录校验规则
    layui.form.verify({
        // 定义了一个叫做pwd消炎规则
        pwd: [/^[\S]{6,12}$/, '密码必须是6-12位，且不能出现空格~'],
        repwd: function (value) {
            // 通过形参(value)拿到确认密码框中的内容
            // 需要拿到密码框中的内容，然后进行一次等于的判断
            // 如果判断失败，则return一个提示消息即可
            let pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }

    })

    // 3.注册表单提交事件（注册）
    $('#regForm').on('submit', submitData);


    // 4.注册表单提交事件（登录）
    $('#form_login').submit(function (e) {
        e.preventDefault();
        // a 获取登录表单数据
        let dataStr = $(this).serialize();

        // b.异步请求提交到登录接口
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: dataStr,
            success(res) {
                // 登录失败
                if (res.status != 0) return layui.layer.msg(res.message);
                //    登录成功
                layui.layer.msg(res.message, {
                    icon: 6,
                    time: 1500  //1.5秒关闭（如果不配置，默认是3秒）
                }, function () {
                    // a.保存token值到localstorage
                    localStorage.setItem('token', res.token);
                    // b.跳转到index.html
                    location.href = '/index.html';
                });
            }
        });
    });
})


// 根路径
let baseUrl = 'http://ajax.frontend.itheima.net';
// 1.注册函数
function submitData(e) {
    //a 阻断表单默认提交
    e.preventDefault();
    // b 获取表单数据

    let dataStr = $(this).serialize();
    //  c 发送表单请求
    $.ajax({
        url: '/api/reguser',
        method: 'POST',
        data: dataStr,
        success(res) {

            // 不论成功与否，都显示消息
            layui.layer.msg(res.message);
            // 注册出错时
            if (res.status != 0) return;

            // 注册成功
            // 将用户名 密码自动填充到登录表单中
            let uname = $('.reg-box [name=username]').val().trim();
            $('.login-box [name=username]').val(uname);

            let upwd = $('.reg-box [name=password]').val().trim();
            $('.login-box [name=password]').val(upwd);

            // 清空注册表单
            $('#regForm')[0].reset();
            // 切换到登录
            $('#link_login').click();
        }
    });
}

