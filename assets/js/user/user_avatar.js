

$(function () {
    initCropper();

    // 为上传按钮添加点击事件
    $('#btnChooseImage').on('click', chooseFile);

     // 为文件选择框 绑定 onchange事件，获取选中文件
     $('#file').on('change', fileChange);
    // 为确认上传按钮添加点击事件
    $('#btnOk').on('click', upload);

   

});

//0. 配置选项
// 获取裁剪区域的 DOM 元素
let $image = null;

const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}


// 1.初始化 剪切插件
function initCropper() {
    $image = $('#image')
    // 1.1 创建裁剪区域
    $image.cropper(options)

}

// 1.选择文件
function chooseFile() {
    $('#file').click();
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

// 3.确认上传
function upload() {
    // a. 获取选中的剪裁后的图片数据
    let dataURL = $image
        .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')  //将Canvas画布上的内容转化为base64格式的字符串
    console.log(dataURL);

    // b.提交到服务器 接口
    $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL
        },
        success: function (res) {
            // 如果失败，退出函数
            if (res.status !== 0) {
                return layui.layer.msg('更换头像失败！')
            }
            layui.layer.msg('更换头像成功！')
            // 如果上传成功，则调用父页面 的方法 重新渲染用户信息
            window.top.getUserInfo()
        }
    })



}