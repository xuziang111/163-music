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
        render(data){
            let songs = data
            $(this.el).html(this.template)
            console.log('songs')
            console.log(songs)
            let liList = songs.map((song)=>$("<li></li>").text(song.name))
            console.log('liList')
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
            })
        },
        bingEventHub(){
            window.eventHub.on('creat',(songData)=>{//订阅creat事件
                console.log('song-list得到了data')
                this.model.data.push(songData)
                console.log('data在哪')
                this.view.render(this.model.data)
                console.log('data在哪')
            })
        }
    }
    controller.init(view,model)
}