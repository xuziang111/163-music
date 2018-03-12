{
    let view = {
        el:'section>.newsong',
        template:`
        <li>
            <a href="./song.html?id={{song.id}}">
                <div class="newSongList-left">
                    <h3>{{song.name}}</h3>
                    <p>{{song.singer}}</p>
                </div>
                <div class="newSongList-right">
                    <span></span>
                <div>
                </a>
            </li>
        `,
        render(data={}){ //根据data描绘左侧列表
            let {songs} = data
            songs.map((song)=>{
                let $li = $(this.template
                    .replace('{{song.name}}',song.name)
                    .replace('{{song.singer}}',song.singer)
                    .replace('{{song.id}}',song.id)
                )
                $(this.el).find('ul').append($li)
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