let $image = null;
let options = null;
// 入口函数
$(function () {
    //0. 初始化富文本编辑器
    initEditor();

    //1. 请求分类=努力下拉框数据并渲染下拉框
    initCateList();

    // 2.1 初始化图片裁剪器
    $image = $('#image');

    // 2.2. 裁剪选项
    options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };
    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 4.为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    });

    // 5.为文件选择框绑定
    $("#coverFile").on('change', fileChange);

    // 6.为发布和草稿按钮绑定事件
    $('#btnPublish').on('click', publish);

    // 7.为表单绑定提交事件
    $('#form-pub').on('submit', doSubmit);

});



// 1.请求分类下拉框数据，渲染下拉框
function initCateList() {
    // a.异步请求，分类列表数据
    $.ajax({
        url: '/my/article/cates',
        method: 'GET',
        success(res) {
            console.log(res);
            // 读取模板并结合res.data生成下拉框html
            let strHtml = template('tpl-cate', res);
            console.log(strHtml);
            // c. 将下拉框html设置给select标签
            $('select[name=cate_id]').html(strHtml);
            //   重新渲染 layui下拉框
            layui.form.render();
        }
    })

}

// 2.选中文件
function fileChange(e) {
    // 0.获取选中文件信息的数组
    let fileList = e.target.files;
    if (fileList.length == 0) return layui.layer.msg('请选择文件哟~');

    // 1. 拿到用户选择的文件  获取选中的第一个文件信息对象
    let file = e.target.files[0]
    // 2. 将文件，转化为路径  创建文件虚拟路径
    let imgURL = URL.createObjectURL(file)

    // 显示新图片
    // 3. 重新初始化裁剪区域    销毁组件，销毁之前的图片 设置新的虚拟路径，并重新创建裁剪区
    $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', imgURL) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域

    console.log('~~~~~~~~~~~~~~~');
    console.log(fileList);
}

// 3.确认上传 发布和草稿共用的 点击事件处理函数
let state = '已发布';
function publish() {
    state = '已发布';

}

function draft() {
    state = '草稿';
}

// 4.表单绑定提交处理事件函数
function doSubmit(e) {
    // a.阻断表单提交
    e.preventDefault();
    // b 获取 表单数据，装入formdata对象（有文件要上传）
    let fd = new FormData(this);
    // c.为formdate追加state值（已发布/草稿）
    fd.append('state', state);
    // d.wei formdata追加剪裁后的文件数据
    $image
        .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function (blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 5. 将文件对象，存储到 fd 中
            fd.append('cover_img', blob)
            // 6. 发起 ajax 数据请求
            // d.提交的熬接口
            $.ajax({
                url: '/my/article/add',
                method: 'POST',
                data: fd,
                // 注意：如果向服务器提交的是 FormData 格式的数据，
                // 必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('发布文章失败！')
                    }
                    layer.msg('发布文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                    location.href = '/article/art_list.html'
                }
            })
        });


}



