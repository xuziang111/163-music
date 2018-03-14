{
    let view = {
        el:'#page-3',
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
            this.bindEvents()
            console.log($(this.view.el).find('input'))
        },
        bindEvents(){
            $(this.view.el).find('input').on('keyup',()=>{
                console.log($(this.view.el).find('input'))
                console.log($(this.view.el).find('label'))
                console.log($(this.view.el).find('input').val())
                if($(this.view.el).find('input').val()){
                    $(this.view.el).find('label').hide()
                }else{
                    $(this.view.el).find('label').show()
                }
            })
        },
        bindEventHub(){
            window.eventHub.on('selectTab',(tabName)=>{
                if(tabName === 'page-3'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        }
    }
    controller.init(view,model)
}