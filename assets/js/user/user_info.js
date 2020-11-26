
// 入口函数
$(function () {

    // 为layui添加校验规则
    layui.form.verify({
        nikname: [/^\S{6,12}$/, '昵称必须在6-16位之间']

    });

    // 1.加载用户基本信息

    initUserInfo();

    //2. 重置表单数据
    $('#btnReset').on('click', function () {
        initUserInfo();

    });

    // 3.表单提交事件
    $('.layui-form').on('submit', submitData);


})

// 1.加载用户基本信息
function initUserInfo() {

    $.ajax({

        url: '/my/userinfo',
        method: 'GET',
        success(res) {
            // 判断错误
            if (res.status != 0) return layui.layer.msg(res.message);
            // 将数据装入同名的表单元素中   调用 form.val()快速为表单赋值
            layui.form.val('userForm', res.data);
        }


    });

}
// 2.提交表单数据
function submitData(e) {

    // 阻止表单事件
    e.preventDefault();
    $.ajax({
        url: '/my/userinfo',
        method: 'POST',
        data: $(this).serialize(),
        success(res) {
            // 不管成功与否，都显示消息
            layui.layer.msg(res.message);
            // 如果有错，停止函数执行
            if (res.status !== 0) return;

            // 如果没有出错，则通过window.parent或者
            // window.top调用父页面的方法
            window.top.getUserInfo();
        }

    });
}

