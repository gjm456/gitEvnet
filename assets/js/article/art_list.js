

// 入口函数
$(function () {
    // 创建时间格式化过滤器
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date);

        let year = dt.getFullYear();
        let month = padZero(dt.getMonth() + 1);
        let day = padZero(dt.getDate());
        let hour = padZero(dt.getHours());
        let minute = padZero(dt.getMinutes());
        let second = padZero(dt.getSeconds());

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //3. 调用为查询表单添加绑定事件函数
    $('#form-search').on('submit', formSearch);
    // 1.调用加载文章列表函数
    initArtList();
    // 2.调用加载 分类下拉框函数
    initCate();
    // 4.为未来的删除按钮代理点击事件
    $('tbody').on('click', '.btn-delete', del);
})

// 全局变量 分页查询参数对象
let q = {
    pagenum: 1,   //页码值
    pagesize: 2,   //每页显示条数为2条
    cate_id: '',   //所属分类ID
    state: ''   //状态值为：已发布，草稿
};

// 1.加载文章列表
function initArtList() {

    $.ajax({
        method: 'GET',
        url: '/my/article/list',
        data: q,
        success(res) {
            console.log(res);
            // 1.遍历数组中生成html字符串
            let strHtml = template('tpl-list', res);
            //2. 使用模板引擎渲染页面的数据

            $('tbody').html(strHtml);
            // 3.调用生成页码条方法
            renderPage(res.total);
        }
    })
}

// 2.加载 分类下拉框
function initCate() {

    $.ajax({
        url: '/my/article/cates',
        method: 'GET',
        success(res) {
            console.log(res);
            // 调用模板引擎渲染分类的可选项
            let strHtml = template('tpl-cate', res)
            console.log(strHtml);
            // 将html代码添加到分类下拉框中
            $('[name=cate_id]').html(strHtml)
            // 通知 layui 重新渲染表单区域的UI结构
            layui.form.render()
        }
    });
}

// 3.为筛选表单绑定 submit事件
function formSearch(e) {
    // a.阻断表单提交
    e.preventDefault();

    // b 逐一获取查询表单下拉框的数据
    q.cate_id = $('[name=cate_id]').val();
    q.state = $('[name=state]').val();

    console.log(q);

    // d.重新加载 文字列表
    initArtList();
}


// 4.生成页码条
/* 
注意：laypage 中的jump函数触发机制:
1.laypage,render 会执行首次触发
2.点击页码时触发
3.切换页容量下拉框时触发

*/
function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页的结构
    layui.laypage.render({
        elem: 'pageBar', // 分页容器的 Id
        count: total, // 总数据条数
        limit: q.pagesize, // 每页显示几条数据
        curr: q.pagenum, // 设置默认被选中的分页
        // 页码条功能
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10],  //页容量选项


        jump(obj, first) {  //点击页码的回调函数事件
            console.log('当前点击页码：', obj.curr);
            q.pagenum = obj.curr; //获取当前页码，设置给分页查询参数
            q.pagesize = obj.limit;   //获取 下拉框中 选中的页容量 设置给分页查询参数
            // 根据最新的q 获取对应的数据列表，并渲染表格

            // 当点击页码时，
            if (!first) {
                initArtList();
            }

        }
    });
}

// 5.删除业务
function del() {
    console.log('id', this.dataset.id);

    let id = this.dataset.id;
    // 如果用户点击确认，则执行回调函数
    layui.layer.confirm('亲亲，确认要删除这条数据吗？', function (index) {
        // 获取页面上剩余行数
        let rows = $('tbody tr .btn-delete').length;

        console.log('要删除的对象是', id);
        // 发送异步请求
        $.ajax({
            url: '/my/article/delete/' + id,
            method: 'GET',
            success(res) {
                layui.layer.msg(res.message);
                if (res.status != 0) return;
                // 删除成功后 需要判断是否已经没有了，如果么有则 页码-1
                if (rows <= 1) {
                    // 如果当前页码已经是第一页，则热然保存1
                    // 如不是第一页，则 -1
                    q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                }

                // 如果删除成功，则重新请求
                initArtList();
            }

        });
        // 关闭当前确认框
        layui.layer.close(index);
    });
}