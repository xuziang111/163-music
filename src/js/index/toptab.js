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
            $(this.view.el).on('click','li',(e)=>{
                $li = $(e.currentTarget)
                let pageName = $li.attr('data-tab')
                $li.addClass('active').siblings().removeClass('active')
                window.eventHub.emit('selectTab',pageName)
            })
        },
        bindEventHub(){

        }
    }
    controller.init(view,model)
}