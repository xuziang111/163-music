{
    let view={
        el:'.page > main',
        template:`
        <h1>新建歌曲</h1>
		<form class="form">
			<div class="row">
				<label>
					歌名
				</label>
				<input name="name"type="text" value="__name__">				
				</div>
			<div class="row">
				<label>
					歌手
				</label>
				<input name="singer"type="text" value="__singer__">				
			</div>
			<div class="row">
				<label>
					外链
				</label>
				<input name="url" type="text" value="__url__">				
			</div>
			<div class="row">
				<button type="submit">保存</button>
			</div>
		</form>
        `,
        render(data={}){ //从文件名获取信息 并填充到表单里
			let placeholders = ['name','singer','url']
			if(data.key){
				let xxx = data.key.split(/ - /,2);
				console.log(xxx)
				data['singer'] = xxx[0]
				data['name'] = xxx[1]
			}			
			let html = this.template
			placeholders.map((string)=>{
				html = html.replace(eval('/__'+ string +'__/g'),data[string] || '')
			})
			$(this.el).html(html)
        }
    }
    let model = {
		data:{
            name:'',
            singer:'',
            url:'',
            id:'',
        },
        creat(data){
            var Songs = AV.Object.extend('Songs');
	        var songs = new Songs();
            return songs.save({//返回一个promise对象 于bindEvents中
				name:data.name,
				singer:data.singer,
            	url:data.url,
			})
            .then((newSongs)=>{
				console.log('xxxx')
				  let {id,attributes} = newSongs
				  Object.assign(this.data,{id,...attributes})
				  console.log(this.data)
	        })
        }
	}
    let controller = {
        init(view,model){
            this.view=view;
            this.model=model;
			this.view.render(this.model.data)
			this.bindEvents()
			window.eventHub.on('upload',(data)=>{ //订阅upload事件
                console.log('song-form得到了data')
				this.reset(data)
            })
		},
		reset(data){
			this.view.render(data)
		},
		bindEvents(){ //给表单绑定一个事件获取一个id
			console.log($(this.view.el))
			$(this.view.el).on('submit','form',(e)=>{
				e.preventDefault();
				let needs = 'name singer url'.split(' ')
				let data = {}
				needs.map((string)=>{
					data[string]=$(this.view.el).find(`[name='${string}']`).val()
				})
				this.model.creat(data).then(()=>{
					console.log(this.model.data)
					this.view.render(this.model.data)
					let string = JSON.stringify(this.model.data)
					let object = JSON.parse(string)
					window.eventHub.emit('creat',object)
				})
				console.log('------------------------------lllllllllllllll')
				console.log(data)
			})
		},
    }
    controller.init(view,model);
}