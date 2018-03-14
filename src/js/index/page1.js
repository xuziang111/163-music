{
    //远古时期引入模块
    function requirePage(src){
        let script = document.createElement('script') 
        script.src=src
        script.onload = function(){
            console.log(src)
        }
        document.body.appendChild(script)
    }
    requirePage("./js/index/page-1-1.js")
    requirePage("./js/index/page-1-2.js")
    //引入模块结束
    let view = {
        el:'#page-1',
        show(){
            $(this.el).addClass('active')
        },
        hide(){
            $(this.el).removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.on('selectTab',(tabName)=>{
                if(tabName === 'page-1'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        }
    }
    controller.init(view,model)
}