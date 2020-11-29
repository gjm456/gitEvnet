

$(function () {

    initArtCateList();

    // 通过代理方式，为未来的 新增表单绑定提交事件

    $('#btnAddCate').on('click', showWindow);

    $('body').on('submit', '#form-add', doAdd);

    // 通过代理方式，为未来的 删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', doDelete);

    // 通过代理方式，为btn-edit 编辑按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', showEdit);


})

// 1.加载文章分类 列表
function initArtCateList() {
    $.ajax({
        url: '/my/article/cates',
        methode: 'GET',
        success(res) {
            console.log(res);

            // 1.遍历数组 生成html
            let strHtml = template('tpl-table', res);
            // 2.将html字符串渲染到tbody中
            $('tbody').html(strHtml);

        }
    });

}

// 保存 弹出层的id
let layerID = null;

// 2.显示新增窗口
function showWindow() {
    layerID = layer.open({
        type: 1,
        area: ['500px', '260px'],
        title: '添加文章分类',
        content: $('#tpl-window').html()
    });
}

//3.执行新增/编辑  通过代理事件，为form-add表单绑定添加点击事件
function doAdd(e) {
    e.preventDefault();
    console.log('开始提交了哟！');

    // 获取弹出层标题
    let title = $('.layui-layer-title').text().trim();
    // 新增操作
    if (title == '添加文章分类') {
        // a.获取数据
        let dataStr = $(this).serialize();
        // 将数字字符串中的id=&替换成空字符串
        dataStr = dataStr.replace('Id=&', '');

        // 需要判断当前提交是新增还是编辑操作
        // b.异步提交
        $.ajax({
            url: '/my/article/addcates',
            method: 'POST',
            data: dataStr,
            success: function (res) {
                layui.layer.msg(res.message);
                if (res.status != 0) return;
                // c.重新获取分类列表
                initArtCateList()
                // d.根据索引，关闭对应的弹出层
                layui.layer.close(layerID)
            }
        })
    } else {
        // 编辑操作
        $.ajax({
            url: '/my/article/updatecate',
            method: 'POST',
            data: $(this).serialize(),
            success(res) {
                layui.layer.msg(res.message);
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                // c.重新获取分类列表
                initArtCateList()

                layer.msg('更新分类成功！')
                // d.根据索引，关闭对应的弹出层
                layui.layer.close(layerID)
            }
        });
    }

}

// 4.执行删除
function doDelete() {
    // let id = this.getAttribute('data-id');
    // H5中提供了获取dataset.id属性的 快捷语法
    let id = this.dataset.id;

    // 如果用户点击确认，则执行回调函数
    layui.layer.confirm('亲亲，确认要删除这条数据吗？', function (index) {



        console.log('要删除的对象是', id);
        // 发送异步请求
        $.ajax({
            url: '/my/article/deletecate/' + id,
            method: 'GET',
            success(res) {
                layui.layer.msg(res.message);
                if (res.status != 0) return;

                // 如果删除成功，则重新请求
                initArtCateList();
            }

        });
        // 关闭当前确认框
        layui.layer.close(index);
    });

}

// 5.显示编辑
function showEdit() {
    console.log(this.dataset.id);

    // a.弹出层   // 弹出一个修改文章分类信息的层
    layerID = layui.layer.open({
        type: 1,
        area: ['500px', '260px'],
        title: '编辑文章分类',
        content: $('#tpl-window').html()
    });

    // b.获取id
    let id = this.dataset.id;
    // c.将当前行的数据，显示到弹出层的文本框中
    $.ajax({
        url: '/my/article/cates/' + id,
        method: 'GET',
        success(res) {
            console.log(res);
            // 将获取的文章分类 数据自动装填到表单元素中
            layui.form.val('formData', res.data);

        }
    });
}

