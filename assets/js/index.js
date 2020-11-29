// 在dom数创建完成后，开始执行
$(function () {

    getUserInfo();

    // 
    $('#btnLoginout').on('click', loginout);

})

// 1.加载 用户的基本信息
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success(res) {
            if (res.status != 0) return layui.layer.msg(res.message);
            //   渲染用户信息头像
            renderAvatar(res.data);
        }

    });
}

// 2.渲染用户信息的函数
function renderAvatar(userData) {
    // a 获取用户名的（昵称/登录名）
    let userName = userData.nickname || userData.username;
    // b 设置给 welcome span标签
    $('#welcome').html(userName);

    // c 渲染头像
    if (userData.user_pic != null) {
        // c1有图片头像
        $('.layui-nav-img').attr('src', userData.user_pic).show();

        // 隐藏文字头像
        $('.text-avatar').hide();  //隐藏图片头像
    } else {
        // c2 没有图片头像 使用文本头像
        $('.layui-nav-img').hide();
        // 获取名字首字母
        let firstChar = userName[0].toUpperCase();
        // 设置文字并显示
        $('.text-avatar').text(firstChar).show();
    }
}

// 3.退出按钮函数
function loginout() {
    //a 弹出 确认框
    layer.confirm('是否要退出当前登录账户~~', { icon: 3, title: '系统提示' }, function (index) {
        // b删除 localStorage 中的token值
        localStorage.removeItem('token');
        // c. 跳转到login.html
        location.href = '/login.html';
        // d.关闭当前页面
        layer.close(index);
    });

}
