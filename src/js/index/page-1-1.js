{
    let view = {
        el:'section>.playlist',
        template:`
        <h2>推荐歌单</h2>
        <div class="list">
            <div class="list-up">
                <a href="./playlist.html">
                    <div class="list-up-li">
                        <div class="image"><span>222.22万</span></div>
                        <p>我是几行字我是几行字</p>
                    </div>
                </a>
                <a href="./playlist.html">
                    <div class="list-up-li">
                        <div class="image"><span>222.22万</span></div>
                        <p>我是几行字我是几行字</p>
                    </div>
                    </a>
                    <a href="./playlist.html">
                        <div class="list-up-li">
                            <div class="image"><span>222.22万</span></div>
                            <p>我是几行字我是几行字</p>
                        </div>
                    </a>
                </div>
            <div class="list-down">
                <a href="./playlist.html">
                    <div class="list-down-li">
                        <div class="image"><span>222.22万</span></div>
                        <p>我是几行字我是几行字</p>
                    </div>
                </a>
                <a href="./playlist.html">
                    <div class="list-down-li">
                        <div class="image"><span>222.22万</span></div>
                        <p>我是几行字我是几行字</p>
                    </div>
                </a>
                <a href="./playlist.html">
                    <div class="list-down-li">
                        <div class="image"><span>222.22万</span></div>
                        <p>我是几行字我是几行字</p>
                    </div>
                </a>
            </div>
        </div>
        `,
        render(){ //根据data描绘左侧列表
            console.log('xxx')
            $(this.el).html(this.template)
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.render()
        },
    }
    controller.init(view,model)
}