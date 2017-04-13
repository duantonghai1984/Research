/**
 * @author duant
 */
var SimpleHandler=function(){};
SimpleHandler.prototype={
	request:function(method, url, callback,postVars){
		var xhr=this.createXhrObject();
		xhr.onreadstatechange=function(){
			if(xhr.readState!==4) return;
			(xhr.status===200)?callback.sucess(xhr.responseText,xhr.responseXML):
			callback.failure(xhr.status);
		};
		xhr.open(method,url,true);
		if(method!=='POST') postVars=null;
		xhr.send(postVars);
	},
	
	createXhrObject:function(){
		var methods=[
		function(){return new XMLHttpRequest();},
		function(){return new ActiveXObject('Msxml2.XMLHTTp');}
		];
		
		for(var i=0,len=methods.length;i<len;++i){
			try{
				method[i]();
			}catch(e){
				continue;
			}
			this.createXhrObject=method[i];
		    return methods[i];
		}
		throw new Error("exception happen");
	}
};
