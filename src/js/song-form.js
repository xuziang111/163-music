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
				<input type="text" value="__name__">				
				</div>
			<div class="row">
				<label>
					歌手
				</label>
				<input type="text" value="__song__">				
			</div>
			<div class="row">
				<label>
					外链
				</label>
				<input type="text" value="__link__">				
			</div>
			<div class="row">
				<button type="submit">保存</button>
			</div>
		</form>
        `,
        render(data={}){
			let placeholders = ['name','song','link']
			if(data.key){
				let xxx = data.key.split(/ - /,2);
				console.log(xxx)
				data['name'] = xxx[0]
				data['song'] = xxx[1]
			}
			
			let html = this.template
			placeholders.map((string)=>{
				html = html.replace(eval('/__'+ string +'__/g'),data[string] || '')
				console.log(html)
				console.log('---------------------')
				console.log(data[string])
			})
			$(this.el).html(html)
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view=view;
            this.model=model;
			this.view.render(this.model.data)
			window.eventHub.on('upload',(data)=>{
                console.log('song-form得到了data')
				console.log(data)
				this.reset(data)
            })
		},
		reset(data){
			this.view.render(data)
		}
    }
    controller.init(view,model);
}