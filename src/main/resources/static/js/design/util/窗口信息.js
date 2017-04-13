
/**
 * 给定div在屏幕滚动时，始终处于窗口可视区域
 */
window.onscroll = window.onresize = window.onload = function(divId){
	var odiv = document.getElementById(divId);
	odiv.style.position="fixed";
	
	var sTop = document.documentElement.scrollTop || document.body.scrollTop;
	var cHeight= document.documentElement.clientHeight || document.body.clientHeight;
	var mid = (cHeight - odiv.offsetHeight) / 2; 
	odiv.style.top = parseInt(sTop + mid) + "px";   //理论上应该只设这句就可以居中吧
	
	//实际上的 各大浏览器只认识下面这if判断
	if(navigator.appVersion.indexOf("MSIE 6")> -1){
		odiv.style.top = parseInt(sTop + mid) + "px";
	}else{
		odiv.style.top =mid + "px";
	}
};


function getWindowInfo(){
	//获取浏览器显示区域的高度
	$(window).height();
	//获取浏览器显示区域的宽度
	$(window).width();

	//获取页面的文档高度
	$(document.body).height();
	//获取页面的文档宽度
	$(document.body).width();

	//获取滚动条到顶部的垂直高度
	$(document).scrollTop();
	//获取滚动条到左边的垂直宽度
	$(document).scrollLeft(); 
	
	$('#dlg').dialog('open');
	$("#dlg").panel("move",{top:$(document).scrollTop() + ($(window).height()-250) * 0.5}); 
}


