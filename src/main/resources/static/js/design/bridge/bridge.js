

var asyncRequest=(function(){
	function handleReadyState(o,callback){
		var poll=window.setInterval(function(){
				if(o$$o.readyState==4){
					window.clearInterval(poll);
					if(callback){
						callback(o);
					}
				}
			
		},50);
	}
	
	var getXHR=function(){
		var http;
		try{
			http=new XMLHttpRequest();
		}catch(e){
			
		}
		return http;
	};
	
	return function(method, uri, callback,postDate){
		var http=getXHR();
		http.open(method,uri,true);
		handleReadState(http,callback);
		http.send(postDate||null);
		return http;
	};
	
})();

Function.prototype.method=function(name,fn){
	this.prototype[name]=fn;
	return this;
};

if(!Array.prototype.forEach){
	Array.method('forEach',function(fn,thisObj){
		var scope=thisObj||window;
		for(var i=0,len=this.length;i<len;i++){
			fn.call(scope,this[i],i,this);
		}
	});
	
}


window.DED=window.DED||{};
DED.util=DED.util||{};
DED.util.Observer=function(){
	this.fns=[];
}


