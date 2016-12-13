//使用插件
;(function($){
	new Drop("inner",{
		refresh:function(that){//指的就是构造函数
			setTimeout(function(){
				$.ajax({
					url:"data/update.json",
					dataType:"json",
					type:"post",
					success:function(data){
						refreshPage(data,that);//that指的就是构造函数
					},
					error:function(){
						alert("请求失败");
					}
				})
			},1000)
		},
		load:function(that){//指的就是构造函数
			setTimeout(function(){
				$.ajax({
					url:"data/more.json",
					dataType:"json",
					type:"post",
					success:function(data){
						addPage(data,that);//that指的就是构造函数
					},
					error:function(){
						alert("请求错误");
					}
		})
			},1000)
		}
	})

	//刷新页面
	function refreshPage(json,that){
		var str="";
		$.each(json.lists,function(i,e){
			str+='<a href="####">'+
					'<img src="'+e.pic+'">'+
					'<h3>'+e.title+'</h3>'+
					'<span>'+e.date+'</span>'+
				'</a>'
		})
		$(".lists").html(str);
		//接着删除盒子(正在刷新...)，首先找到盒子
		$(".d_box")
			.css("height","0")
			.on("webkitTransitionEnd",function(){
				$(this).remove();
				that.isHave=false;
			});
	}

	//加载页面
	function addPage(json,that){
		var str="";
		$.each(json.lists,function(i,e){
			str+='<a href="####">'+
					'<img src="'+e.pic+'">'+
					'<h3>'+e.title+'</h3>'+
					'<span>'+e.date+'</span>'+
				'</a>'
		})
		$(".lists").append(str);
		//删除盒子
		$(".u_box")
			.css("height","0")
			.on("webkitTransitionEnd",function(){
				$(this).remove();
				that.isHave=false;
			})
	}
})(Zepto)