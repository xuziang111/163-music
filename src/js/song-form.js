{
    let view={
        el:'.page > main',
        template:`
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
			if(data.id){
				$(this.el).prepend('<h1>编辑歌曲</h1>')
			}else{
				$(this.el).prepend('<h1>新建歌曲</h1>')
			}
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
			window.eventHub.on('selectSong',(data)=>{//被点击的songData传入
				this.view.render(data)
				this.model.data = data           //将歌曲信息填充到表单
				console.log(data)
			})
			window.eventHub.on('clickNewSong',()=>{//新建歌曲被点击时清空表单
				this.model.data = {name:'',singer:'',url:'',id:'',}
				this.reset(this.model.data)
			})
		},
		reset(data){
			this.view.render(data)
		},
		create(){
			let needs = 'name singer url'.split(' ')
			let data = {}
			needs.map((string)=>{
				data[string]=$(this.view.el).find(`[name='${string}']`).val()
			})
			this.model.creat(data).then(()=>{
				console.log(this.model.data)
				this.view.render(this.model.data)
				let string = JSON.stringify(this.model.data)//深拷贝
				let object = JSON.parse(string)
				window.eventHub.emit('creat',object)
			})
			console.log('------------------------------lllllllllllllll')
			console.log(data)
		},
		upData(){
			let needs = 'name singer url'.split(' ')
			let data = {}
			needs.map((string)=>{
				data[string]=$(this.view.el).find(`[name='${string}']`).val()
			})
			  // 第一个参数是 className，第二个参数是 objectId
  			var songs = AV.Object.createWithoutData('Songs', this.model.data.id);
  			// 修改属性
			  songs.set('name', data.name);
			  songs.set('singer', data.singer);
			  songs.set('url', data.url);
  			// 保存到云端
  			songs.save();
		},
		bindEvents(){ //给表单绑定一个事件获取一个id
			console.log($(this.view.el))
			$(this.view.el).on('submit','form',(e)=>{
				e.preventDefault();
				if(this.model.data.id){
					console.log('id存在')
					this.upData()
				}else{
					console.log('id不存在')
					this.create()
				}
			})
		},
    }
    controller.init(view,model);
}