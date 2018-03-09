{
    let view = {
        el:'#songList-container',
        template:`
        <ul class="songList">

		</ul>
        `,
        activeItem(li){
            let $li = $(li)
            $li.addClass('active').siblings().removeClass('active')
        },
        render(data){ //根据data描绘左侧列表
            let songs = data
            $(this.el).html(this.template)
            let liList = songs.map((song)=>$("<li></li>").text(song.name).attr('data-id',song.id))
            $(this.el).find('ul').empty()
            liList.map((domLi)=>{
                $(this.el).find('ul').append(domLi)
            })
        }
    }
    let model = {
        find(){
            var query = new AV.Query('Songs')
            return query.find().then((songs) => {
                this.data.songs = songs.map((song)=>{
                    return {id:song.id,...song.attributes}
                })
                return songs
            })
        },
        data:{
            songs:[]
        }
    }
    let controller = {
        init(view,model){
            this.view=view;
            this.model=model;
            this.bindEvents()
            this.getSongs()
            this.bingEventHub()
        },
        getSongs(){
            this.model.find().then(()=>{
                this.view.render(this.model.data.songs)
            })
        },
        bindEvents(){
            $(this.view.el).on('click','li',(e)=>{
                this.view.activeItem(e.currentTarget)
                let songID = e.currentTarget.getAttribute('data-id')
                let songs = this.model.data.songs
                let selectSongData = {}
                for(let i=0;i<songs.length;i++){
                    if(songs[i].id === songID){
                        selectSongData = songs[i]
                        break
                    }
                }
                window.eventHub.emit('select',JSON.parse(JSON.stringify(selectSongData)))//深拷贝。列表中歌曲被点击，右侧显示歌曲信息
            })
        },
        bingEventHub(){
            window.eventHub.on('creat',(songData)=>{//订阅creat事件，将歌曲推入左侧列表
                this.model.data.push(songData)
                this.view.render(this.model.data)

            })
        }
    }
    controller.init(view,model)
}