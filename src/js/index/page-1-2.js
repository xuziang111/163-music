{
    let view = {
        el:'section.newsong',
        template:`
        <ul class='newSongList'>
        </ul>
        `,
        render(data){ //根据data描绘左侧列表
            let songs = data
            $(this.el).html(this.template)
            let liList = songs.songs.map((song)=>{
                let $li = $(`<li>
                <h3>${song.name}</h3>
                <p>${song.singer}</p>
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
        }
    }
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        },
    }
    controller.init(view,model)
}