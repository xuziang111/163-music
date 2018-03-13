{
    let view={
        el:'main>form',
		template:`
		<textarea name="lrc">__lrc__</textarea>
		<div>
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
			<div class="row cover">
				<label>
					封面
				</label>
				<input name="cover" type="text" value="__cover__">				
			</div>
			<div class="row">
				<button type="submit">保存</button>
			</div>
			<div>
		`,
		templateImage:`
				<label>
					封面
				</label>
				<input name="cover" type="text" value="__cover__">				
		`,
        render(data={}){ //从文件名获取信息 并填充到表单里
			let placeholders = ['name','singer','url','cover','lrc']
			console.log(data)
			if(data.key){
				let xxx = data.key.split(/ - /,2);
				if(xxx[1]){
					data['singer'] = xxx[0]
					data['name'] = xxx[1]
				}else{
					data['name'] = data.key
				}
			}			
			let html = this.template
			console.log(data)
			placeholders.map((string)=>{
				if(string === 'lrc'&&(!data['lrc'] || data['lrc'] === '')){
					data['lrc'] = '请在此输入lrc歌词'
				}
				html = html.replace(eval('/__'+ string +'__/g'),data[string] || '')
			})
			$(this.el).html(html)
			if(data.id){
				$('main>form>div').prepend('<h1>编辑歌曲</h1>')
			}else{
				$('main>form>div').prepend('<h1>新建歌曲</h1>')
			}
		},
		renderImage(data){
			let html = this.templateImage
			html = html.replace('__cover__',data.cover || '')
			$(`${this.el}>.cover`).html(html)
		},
    }
    let model = {
		data:{
            name:'',
            singer:'',
            url:'',
			id:'',
			cover:'',
			lrc:'',
        },
        creat(data){
            var Songs = AV.Object.extend('Songs');
	        var songs = new Songs();
            return songs.save({//返回一个promise对象 于bindEvents中
				name:data.name,
				singer:data.singer,
				url:data.url,
				cover:data.cover,
				lrc:data.lrc,
			})
            .then((newSongs)=>{
				console.log('xxxx')
				  let {id,attributes} = newSongs
				  Object.assign(this.data,{id,...attributes})
				  console.log(this.data)
	        })
		},
		update(data){
			var songs = AV.Object.createWithoutData('Songs', this.data.id).bind(this);
			// 修改属性
			console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
			console.log(data)
			songs.set('name', data.name);
			songs.set('singer', data.singer);
			songs.set('url', data.url);
			songs.set('cover', data.cover);
			songs.set('lrc', data.lrc);
			// 保存到云端
			return songs.save().then((response)=>{
				Object.assign(this.data,data)
				return response
			});
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
				data.cover = this.model.data.cover
				this.model.data={name:'',singer:'',url:'',id:'',cover:'',lrc:'',}	
				this.reset(data)
			})
			window.eventHub.on('uploadImage',(data)=>{ //订阅upload事件
				Object.assign(this.model.data,data)
				this.view.renderImage(this.model.data)
			})
			window.eventHub.on('selectSong',(data)=>{//被点击的songData传入
				this.view.render(data)
				this.model.data = data           //将歌曲信息填充到表单
				console.log(data)
			})
			window.eventHub.on('clickNewSong',(data)=>{//新建歌曲被点击时清空表单
				this.model.data={name:'',singer:'',url:'',id:'',cover:'',lrc:'请在此输入lrc歌词'}			
				this.reset(data)
			})
		},
		reset(data){
			this.view.render(data)
		},
		create(){
			let needs = 'name singer url cover lrc'.split(' ')
			let data = {}
			for(let i=0;i<needs.length;i++){
				if(!$(this.view.el).find(`[name='${needs[i]}']`).val()){
					alert(`请输入${needs[i]}`)
					return
				}else{
					data[needs[i]]=$(this.view.el).find(`[name='${needs[i]}']`).val()
				}
			}
			this.model.creat(data).then(()=>{
				console.log(this.model.data)
				this.view.render(this.model.data)
				let string = JSON.stringify(this.model.data)//深拷贝
				let object = JSON.parse(string)
				window.eventHub.emit('creat',object)
			})
			alert('保存成功')
			console.log('------------------------------lllllllllllllll')
			console.log(data)
		},
		upDate(){
			let needs = 'name singer url cover lrc id'.split(' ')
			let data = {}
			needs.map((string)=>{
				data[string]=$(this.view.el).find(`[name='${string}']`).val()
			})
			console.log('woshidata')
			console.log(data)
			data.id = this.model.data.id
			this.model.update(data).then(()=>{
				console.log('wozhiixnglalalala')
				window.eventHub.emit('update',JSON.parse(JSON.stringify(data)))
			})
			alert('更新成功')
		},
		bindEvents(){ //给表单绑定一个事件获取一个id
			console.log($(this.view.el))
			$(this.view.el).on('submit',(e)=>{
				e.preventDefault();
				if(this.model.data.id){
					console.log('id存在')
					this.upDate() //更新歌曲信息
				}else{
					console.log('id不存在')
					this.create()  //新建歌曲信息
				}
			})
		},
    }
    controller.init(view,model);
}