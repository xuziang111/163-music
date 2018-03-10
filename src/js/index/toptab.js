{
    let view = {
        el:'#tabs',
    }
    let model = {

    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.bindEvents()
        },
        bindEvents(){
            console.log('xxx')
            $(this.view.el).on('click','span',(e)=>{
                $span = $(e.currentTarget)
                let pageName = $span.attr('data-tab')
                $span.addClass('active').siblings().removeClass('active')
                window.eventHub.emit('selectTab',pageName)
            })
        },
        bindEventHub(){

        }
    }
    controller.init(view,model)
}