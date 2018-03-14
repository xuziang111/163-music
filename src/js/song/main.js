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
                audio.ontimeupdate = () => {this.showLrc(audio.currentTime)}
            }
            $(this.el).find('h1').text(data.song.name)
            this.renderStyle(data)
            if(status === 'playing'){
                $(this.el).find('.cd-light').addClass('playing')
            }else{
                $(this.el).find('.cd-light').removeClass('playing')
            }
            let {lrc} = song
            let regex = /\[([\d:.]+)\](.+)/

            let array = lrc.split('\n').map((string)=>{
                let p = document.createElement('P')
                let matches = string.match(regex)
                p.textContent = matches[2]
                if(matches){
                    let time = matches[1]
                    let parts = time.split(':')
                    let minutes = parts[0]
                    let secounds = parts[1]
                    newTime = parseInt(minutes,10) * 60 +parseFloat(secounds,10)
                    p.setAttribute('data-time',newTime)
                    p.textContent = matches[2]
                }else{
                    p.textContent = string
                }
                $(this.el).find('.lrc>.lines').append(p)
            })
        },
        renderStyle(data){
            let style = this.template2.replace('{{cover}}',data.song.cover)
            $(this.el2).append(style)
        },
        showLrc(time){
            console.log(time)
            let allP = $(this.el).find('.lrc>.lines>p')
            for(let i=0;i<allP.length;i++){
                if(i===allP.length-1){
                    break
                }else{
                    let currentTime = allP.eq(i).attr('data-time')
                    let nextTime = allP.eq(i+1).attr('data-time')
                    if (currentTime <= time && nextTime > time){
                        let height = allP.eq(i).offset().top - $(this.el).find('.lrc>.lines').offset().top
                        height =height -32
                        $(this.el).find('.lrc>.lines').css('transform',`translateY(-${height}px)`)
                        allP.eq(i).addClass('active').siblings().removeClass('active')
                    }
                }
            }
        },
        play(){
            let audio = $(this.el).find('audio')[0]
            audio.play()
            $(this.el).find(".play-button").removeClass('active')
        },
        pause(){
            let audio = $(this.el).find('audio')[0]
            audio.pause()
            $(this.el).find(".play-button").addClass('active')
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
                this.data.song = song.attributes
                this.data.song.id = id
                console.log(this.data.song)
                //Object.assign(this.data.song,{id:id,...song.attributes})
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
                this.view.render(this.model.data)
                setTimeout(() => {
                    this.view.play()
                }, 0);
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