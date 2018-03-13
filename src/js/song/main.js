{
    let view = {
        el:'#app',
        el2:'head',
        template:`
        `,
        template2:`
        <style>
        body::after{
            background:url("{{cover}}") center center no-repeat; 
            background-size:cover;
        }
        </style>
        `,
        render(data){
            let {song,status} = data
            $('.cd-cover').css('background-image',`url(${data.song.cover})`)
            if( $(this.el).find('audio').attr('src') !== song.url){
                let audio = $(this.el).find('audio').attr('src',song.url).get(0)
                audio.onended = ()=>{window.eventHub.emit('songEnd')}
            }
            $(this.el).find('h1').text(data.song.name)
            this.renderStyle(data)
            if(status === 'playing'){
                $(this.el).find('.cd-light').addClass('playing')
            }else{
                $(this.el).find('.cd-light').removeClass('playing')
            }
        },
        renderStyle(data){
            let style = this.template2.replace('{{cover}}',data.song.cover)
            $(this.el2).append(style)
        },
        play(){
            let audio = $(this.el).find('audio')[0]
            $(this.el).find(".play-button").removeClass('active')
            audio.play()
        },
        pause(){
            let audio = $(this.el).find('audio')[0]
            $(this.el).find(".play-button").addClass('active')
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
                cover:'',
            },
            status:'playing',
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
                console.log('bofangs')
                console.log('bofangs')
                this.view.play()
            })
            this.bindEvents()
        },
        bindEvents(){
            $(this.view.el).on('click',()=>{
                if(this.model.data.status==='paused'){
                    this.view.play()
                    this.model.data.status = 'playing'
                }else{
                    this.view.pause()
                    this.model.data.status = 'paused'
                }
                this.view.render(this.model.data)
            })
            window.eventHub.on('songEnd',()=>{
                console.log('haha')
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
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