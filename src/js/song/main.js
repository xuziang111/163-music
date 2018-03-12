{
    let view = {
        el:'#app',
        template:`
        <h1>{{name}}</h1>
        <audio src={{url}}></audio>
        <button class="play">播放</button>
        <button class="pause">暂停</button>
        `,
        render(data){
            $(this.el).html(this.template.replace('{{url}}',data.song.url).replace('{{name}}',data.song.name))
        },
        play(){
            let audio = $(this.el).find('audio')[0]
            audio.play()
        },
        pause(){
            let audio = $(this.el).find('audio')[0]
            audio.pause()
        }
    }
    let model = {
        data:{
            song:{
                id:'',
                name:'',
                singer:'',
                url:'',
            },
        },
        get(id){
            var query = new AV.Query('Songs');
            return query.get(id).then((song) => {
                Object.assign(this.data.song,{id:id,...song.attributes})
                console.log(song)
                return song 
            }, function (error) {
              alert('获取失败')
            });
        }
    }
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            let id = this.getSongId()
            this.model.get(id).then((song)=>{
                console.log(song)
                this.view.render(this.model.data)
                setTimeout(() => {
                  
                }, 3000);
            })
            this.bindEvents()
        },
        bindEvents(){
            $(this.view.el).on('click','.play',()=>{
                this.view.play()
            })
            $(this.view.el).on('click','.pause',()=>{
                this.view.pause()
            })
        },
        getSongId(){
            let search = window.location.search
            if(search.indexOf('?') === 0){
                search = search.substring(1)
            }
            let array = search.split('&').filter((v=>v))
            let id = ''
            for(let i=0;i<array.length;i++){
                let kv = array[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if(key === 'id'){
                    id = value
                    break
                }
            }
            return id
        },
    }
    controller.init(view,model)
}