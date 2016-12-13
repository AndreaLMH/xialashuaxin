//wrapper就是inner的ID名，但凡这样就要判断
function Drop(wrapper,opt){//要在index.js调用Drop。
	//创建默认参数
	var _default={
		down:{
			d_box:$('<div class="d_box"></div>'),
			d_class:"d_box",
			d_xl:"<p>下拉刷新</p>",
			d_sf:"<p>下拉释放</p>",
			d_loading:"<p class='loading'>正在加载</p>"
		},
		up:{
			u_box:$('<div class="u_box"></div>'),
			u_class:"u_box",
			u_xl:"<p>上拉刷新</p>",
			u_sf:"<p>上拉释放</p>",
			u_loading:"<p class='loading'>正在加载</p>"
		},
		refresh:null,
		load:null
	}
	//源生扩展参数
	for(var key in opt){
		_default[key]=opt[key];//_default被扩展
	}
	this.settings=_default;
	this.wrapper=typeof wrapper==="string"?document.getElementById(wrapper):wrapper;
	//有没有添加过上拉盒子
	this.isHave=false;//用于判断执行上拉或下拉的其中一个动作(不可同时执行)
	//调用方法
	this.bindEvent();
}//end var Drop=function

Drop.prototype={
	bindEvent:function(){
		var that=this,
			d_box=this.settings.down.d_box,
			d_xl=this.settings.down.d_xl,
			d_class=this.settings.down.d_class,
			d_loading=this.settings.down.d_loading,
			d_sf=this.settings.down.d_sf,
			u_box=this.settings.up.u_box,
			u_xl=this.settings.up.u_xl,
			u_class=this.settings.up.u_class,
			u_loading=this.settings.up.u_loading,
			u_sf=this.settings.up.u_sf,
			sFn=function(e){
				e.touches=e.touches || e.originalEventTouches;
				that.startY=e.touches[0].clientY;
				//在touchstart事件中获取滚动条位置
				that.sTop=that.wrapper.scrollTop;
				//获取整个内容的高度（#lists）
				that.conH=that.wrapper.children[0].offsetHeight;
				//获取视口的高，能看见的inner中的内容
				that.winW=that.wrapper.offsetHeight;
			},
			mFn=function(e){
				var refresh=that.settings.refresh,
					load=that.settings.load,
					h=0,//盒子的高度
					html="";//文字(下拉刷新、上拉加载...)
				e.touches=e.touches || e.originalEventTouches;
				that.offsetY=e.touches[0].clientY-that.startY;//偏移距离
				//判断offsetY，设置滑动方向
				if(that.offsetY>0){//向下
					that.direction="down";
				}else{//向上
					that.direction="up";
				}
				//执行“下拉刷新”(条件:滑动方向，scrollTop==0，refresh函数存在)
				if(that.direction=="down" && that.sTop==0 && refresh){
					e.preventDefault();
					//在touchmove中动态创建下拉盒子
					if(!that.isHave){
						d_box.prependTo(that.wrapper);
						that.isHave=true;
					}
					//设置盒子的高度
					if(that.offsetY<50){
						h=that.offsetY;
						html=d_xl;
					}else if(that.offsetY>50 && that.offsetY<100){
						h=50+(that.offsetY-50)*0.5;
						html=d_sf;
					}else{
						
						h=100+(that.offsetY-100)*0.2;
						html=d_sf;
					}
					d_box.html(html);
					$("."+d_class)
						.css("height",h+"px")
						.css("-webkit-transition","none");
				}//下拉刷新

				//执行“上拉加载”(条件:滑动方向,滚动条在底部,load函数存在)
				if(that.direction=="up" && that.sTop>=(that.conH-that.winW) && that.settings.load){
					//在touchmove中动态创建上拉盒子
					if(!that.isHave){
						u_box.appendTo(that.wrapper);
						that.isHave=true;
					}
					var abs=Math.abs(that.offsetY);
					//设置盒子的高度
					if(abs<50){
						h=abs;
						html=u_xl;
					}else if(abs>50 && abs<100){
						h=50+(abs-50)*0.5;
						html=u_sf;
					}else{
						h=100+(abs-100)*0.2;
						html=u_sf;
					}
					u_box.html(html);
					$("."+u_class)
						.css("height",h+"px")
						.css("-webkit-transition","none");
				}
			},
			eFn=function(){//需要执行refresh,load回调函数
				//判断有没有盒子
				if(!that.isHave) return false;
				//判断滑动方向
				if(that.direction=="up"){//向上
					var box=$("."+u_class);
					var loading=u_loading;
					//加载回调
					that.settings.refresh && that.settings.load(that);
				}else{//向下
					var box=$("."+d_class);
					var loading=d_loading;
					//刷新回调
					that.settings.load && that.settings.refresh(that);
				}
				//设置盒子的高为50
				box.css({"height":"50px",
						"-webkit-transition":"height .5s"
				});
				box.html(loading);
			};
		this.wrapper.addEventListener("touchstart",sFn,false);
		this.wrapper.addEventListener("touchmove",mFn,false);
		this.wrapper.addEventListener("touchend",eFn,false);
	}
}
