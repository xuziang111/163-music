{
    let view = {
        el:'#page-2',
        el2:'#page-2>.play_list',
        template:`
        <li>
            <a href="./song.html?id={{song.id}}">
            <div class="list-number">{{index}}</div>
                <div class="newSongList-left">
                    <h3>{{song.name}}</h3>
                    <p>{{song.singer}}</p>
                </div>
                <div class="newSongList-right">
                    <span></span>
                </div>
            </a>
        </li>
        `,
        show(){
            $(this.el).addClass('active')
        },
        hide(){
            $(this.el).removeClass('active')
        },
        render(data={}){ //根据data描绘左侧列表
            let {songs} = data
            let index = 1;
            songs.map((song)=>{
                let $li = $(this.template
                    .replace('{{song.name}}',song.name)
                    .replace('{{song.singer}}',song.singer)
                    .replace('{{song.id}}',song.id)
                    .replace('{{index}}',`0${index}`)
                )
                index++
                if(index<5){
                    $li.addClass('hot_song')
                }
                console.log($li)
                $(this.el2).find('ul').append($li)
            })
        }
    }
    let model = {
        find(){
            var query = new AV.Query('Songs')
            return query.find().then((songs) => {
                this.data.songs = songs.map((song)=>{
                    return Object.assign({id:song.id},song.attributes)
                })
                return songs
            })
        }, 
        data:{
            songs:[],
        }
    }
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.bindEventHub()
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        },
        bindEventHub(){
            window.eventHub.on('selectTab',(tabName)=>{
                if(tabName === 'page-2'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        }
    }
    controller.init(view,model)
}