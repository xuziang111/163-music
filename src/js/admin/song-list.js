{
    let view = {
        el:'#songList-container',
        template:`
        <ul class="songList">

		</ul>
        `,
        render(data){ //根据data描绘左侧列表
            let songs = data
            console.log('xxxxxxxxxxxx')
            console.log(model.data)
            console.log(data.songs)
            $(this.el).html(this.template)
            let liList = songs.songs.map((song)=>{
                console.log('.......xxx')
                let $li = $("<li></li>").text(song.name).attr('data-id',song.id)
                console.log('.......xxx')
                if(song.id === songs.selectID){
                    $li.addClass('active')
                }
                console.log('.......xxx')
                console.log($li)
                return $li
            })
            console.log(liList)
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
                console.log('this.model.data')
                console.log(this.model.data)
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
                this.view.render(this.model.data)
                $(this.view.el + ">ul>li").last().addClass('active')
                console.log($(this.view.el + ">ul>li"))
            })
            window.eventHub.on('clickNewSong',()=>{//订阅clickNewSong事件，将歌曲推入左侧列表           
                $(this.view.el).find('.active').removeClass('active')
            })
            window.eventHub.on('update',(song)=>{ //有数据的情况下更新歌曲信息
                console.log('wozhiixnglalalala')
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