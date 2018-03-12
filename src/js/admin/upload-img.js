{
    let view = {
        el:'.uploadImageArea',
        find(selector){
            return $(this.el).find(selector)[0]
        }
    }
    let model = {    
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.initQiniu()
        },
        initQiniu(){ //初始化七牛
            var uploader = Qiniu.uploader({
            runtimes: 'html5',      // 上传模式,依次退化
            browse_button: this.view.find('#uploadImageButton'),         // 上传选择的点选按钮，**必需**
                uptoken_url:'http://localhost:8888/uptoken',
                get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的 uptoken
            // downtoken_url: '/downtoken',
            // Ajax请求downToken的Url，私有空间时使用,JS-SDK 将向该地址POST文件的key和domain,服务端返回的JSON必须包含`url`字段，`url`值为该文件的下载地址
            // unique_names: true,              // 默认 false，key 为文件名。若开启该选项，JS-SDK 会为每个文件自动生成key（文件名）
            // save_key: true,                  // 默认 false。若在服务端生成 uptoken 的上传策略中指定了 `save_key`，则开启，SDK在前端将不对key进行任何处理
            domain: 'p573ib0ut.bkt.clouddn.com',     // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**
            container: this.view.find('#uploadImageContainer'),             // 上传区域 DOM ID，默认是 browser_button 的父元素，
            max_file_size: '5mb',             // 最大文件体积限制
            max_retries: 3,                     // 上传失败最大重试次数
            dragdrop: true,                     // 开启可拖曳上传
            drop_element: this.view.find('#uploadimageContainer'),          // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
            chunk_size: '2mb',                  // 分块上传时，每块的体积
            auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
            init: {
                'FilesAdded': function(up, files) {
                    plupload.each(files, function(file) {
                        // 文件添加进队列后,处理相关的事情
                    });
                },
                'BeforeUpload': function(up, file) {
                       // 每个文件上传前,处理相关的事情
                       window.eventHub.emit('beforeUpload')
                },
                'UploadProgress': function(up, file) {
                       // 每个文件上传时,处理相关的事情
                },
                'FileUploaded': function(up, file, info) {
                    window.eventHub.emit('afterUpload')
                       // 每个文件上传成功后,处理相关的事情
                       // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
                       // {
                       //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                       //    "key": "gogopher.jpg"
                       //  }
                       // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
        
                        var domain = up.getOption('domain');
                        var response = JSON.parse(info.response);
                        var cover = "http://" + domain + '/' + encodeURIComponent(response.key)
                    
                        window.eventHub.emit('uploadImage',{cover})//发布upload事件
                    },
                'Error': function(up, err, errTip) {
                       //上传出错时,处理相关的事情
                },
                'UploadComplete': function() {
                       //队列文件处理完毕后,处理相关的事情
                }
                    }
                });
            },
    }
    controller.init(view,model)
}