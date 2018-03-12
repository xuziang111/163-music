{
    let view = {
        el:'#songList-container',
        template:`
        <ul class="songList">

		</ul>
        `,
        render(data){ //根据data描绘左侧列表
            let songs = data
            $(this.el).html(this.template)
            let liList = songs.songs.map((song)=>{
                let $li = $(`<li>
                <span>${song.name}</span>
                <span>${song.singer}</span>
                </li>`).attr('data-id',song.id)
                if(song.id === songs.selectID){
                    $li.addClass('active')
                }
                return $li
            })
            $(this.el).find('ul').empty()
            liList.map((domLi)=>{
                $(this.el).find('ul').append(domLi)
            })
        },
        creatRender(data){
            let songs = data
            $(this.el).html(this.template)
            let liList = songs.songs.map((song)=>{
                let $li = $(`<li>
                <span>${song.name}</span>
                <span>${song.singer}</span>
                </li>`)
                return $li
            })
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
            songs:[],
            selectID:undefined,
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
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            $(this.view.el).on('click','li',(e)=>{
                let songID = e.currentTarget.getAttribute('data-id')
                this.model.data.selectID = songID
                this.view.render(this.model.data)              
                let songs = this.model.data.songs
                let selectSongData = {}
                for(let i=0;i<songs.length;i++){
                    if(songs[i].id === songID){
                        selectSongData = songs[i]
                        break
                    }
                }
                window.eventHub.emit('selectSong',JSON.parse(JSON.stringify(selectSongData)))//深拷贝。列表中歌曲被点击，右侧显示歌曲信息
            })
        },
        bingEventHub(){
            window.eventHub.on('creat',(songData)=>{//订阅creat事件，将歌曲推入左侧列表
                this.model.data.songs.push(songData)
                this.view.creatRender(this.model.data)
                $(this.view.el + ">ul>li").last().addClass('active')
                console.log($(this.view.el + ">ul>li"))
            })
            window.eventHub.on('clickNewSong',()=>{//订阅clickNewSong事件，将歌曲推入左侧列表           
                $(this.view.el).find('.active').removeClass('active')
            })
            window.eventHub.on('update',(song)=>{ //有数据的情况下更新歌曲信息
                console.log('wozhiixnglalalala')
                this.model.data.selectID = songID
                let songs = this.model.data.songs
                for(let i=0;i<songs.length;i++){
                    if(songs[i].id === song.id){
                        songs[i] = song
                        break
                    }
                }
                console.log(this.model.data)
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}