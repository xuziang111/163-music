{
    let view = {
        el:'.newSong',
        template:`
        新建歌曲
        `,
        render(data){
            $(this.el).html(this.template);
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view=view;
            this.model=model;
            this.view.render(this.model.data)
            window.eventHub.on('upload',(data)=>{//订阅upload事件
                console.log('new song得到了data')
            })
            window.eventHub.on('selectSong',(data)=>{
                console.log(data.id)
                this.deactive()
            })
            $(this.view.el).on('click',(e)=>{
                console.log('我被点了')
                this.active()
                window.eventHub.emit('clickNewSong')
            })
        },
        deactive(){
            $(this.view.el).removeClass('active')
        },
        active(){
            $(this.view.el).addClass('active')
        }
    }
    controller.init(view,model)
}