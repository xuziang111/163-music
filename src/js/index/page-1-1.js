{
    let view = {
        el:'section>.playlist',
        template:`
        <h2>推荐歌单</h2>
        `,
        render(){ //根据data描绘左侧列表
            console.log('xxx')
            $(this.el).html(this.template)
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.render()
        },
    }
    controller.init(view,model)
}