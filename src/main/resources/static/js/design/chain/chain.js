/**
 * @author duant
 */

(function(){
	function _$(){
		//alert(typeof id);
		 this.elements = [];
		for (var i = 0, len = arguments.length; i < len; ++i) {
			var element = arguments[i];
			if (element instanceof  String) {
				alert("string");
				element = document.getElementById(element);
			}
			this.elements.push(element);
		}
		//return elements;
		//return document.getElementById(id);
	}
	
	_$.prototype={
		each:function(fn){
			for(var i=0,len=this.elements.length;i<len;++i){
				fn.call(this,this.elements[i]);
			}
			return this;
		},
		
		setStyle:function(prop,val){
			this.each(function(el){
				el.style[prop]=val;
			});
			return this;
		},
		
		show:function(){
			var that=this;
			this.each(function(el){
			that.setStyle('display','block');	
			});
			return this;
		}
		/*,
		
		addEvent:function(type,fn){
			var add=function(el){
				if(window.addEventListener){
					el.addEventListener(type,fn,false);
				}else if(window.attachEvent){
					el.attachEvent('on'+type,fn);
				}
			};
			this.each(function(el){
				add(el);
			});
			return this;
		}
		*/
	};
	
	
	window.$=function(){
		return new _$(arguments);
	};
	
})();


var Public=function(){
	
	var secret=3;
	this.privateSecret=function(){
	    return secret;	
	};
};

/*
$(window).addEvent('load', function(){
		alert("data");
	});
	*/
	
function test(){
	/*
    var value=$('name').type;
	alert(value);
	*/
	var pub=new Public;
	alert("fdf"+pub.privateSecret());

}

