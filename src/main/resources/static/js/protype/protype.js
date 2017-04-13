/**
 * @author duant
 */

 var Prototype={
 	
	Version:'1.4.0',
	
	emptyFunction:function(){},
	K:function(x){return x;}
 }
 
 /* ======================================== */
 var Class={
 	create:function(){
		return function(){
			this.initialize.apply(this,argument);
		}
	}
 }
 
 var Abstract=new Object();
 /* ========================================  */
 Object.extend=function(destionation, source){
 	for(property in source){
		destionation[property]=source[property];
	}
	return destination;
 }
 
 Object.inspect=function(object){
 	try{
		if(object==undefined) return 'undefined';
	}catch(e){
		if(e instanceof RangeError) return '...';
		throw e;
	}
 }
 /*========================================== */
 Function.protype.bind=function(){
 	var _method=this,args=$A(arguments),object=args.shift();
	return function(){
		_method.apply(object, args.concat($A(arguments)));
	}
 }
 
 Function.prototype.bindAsEventListener=function(object){
 	var _method=this;
	return function(event){
		return _method.call(object,event||window.event);
	}
 }
 /* =========================================== */

Object.extend(Number.prototype,{
	toColorPart:function(){
		//TODO...
		return 234;
	},
	
	succ:function(){
		return this+1;
	},
	/*
	times:function(iterator){
		$R(0,this,true),each(iterator);
		return this;
	}
	*/
});

/* ==========================================  */
var Try={
	these:function(){
		var returnValue;
		
		for(var i=0;i<arguments.length;i++){
			var lambda=arguments[i];
			try{
				returnValue=lambda();
				break;
			}catch(e){}
		}
		return returnValue;
	}
}

/* =================================== */
var PeriodicalExecuter=Class.create();
PeriodicalExceuter.prototype={
	initialize:function(callback,frequency){
		this.callback=callback;
		this.frequency=frequency;
		this.currentlyExecuting=false;
		this.registerCallback();
	},
	
	registerCallback:function(){
		
	},
	
	onTimeEvent:function(){
		if(!this.currentlyExecuting){
			try{
				this.currentlyExecuting=true;
				this.callback();
			}finally{
				this.currentlyExecuting=false;
			}
		}
	}
}


/* ==================================== */
function $(){
	var element=new Array();
	for(var i=0;i<arguments.length;i++){
		var element=arguments[i];
		if(typeof element==='string'){
			element=document.getElementById(element);
		}
		
		if(arguments.length==1){
			return element;
		}
		elements.push(element);
	}
	return elements;
}

/* =============================================  */
/*
 * Extend String 
 */
Object.extend(String.prototype,{
	stripTags:function(){
		return this.replace(/<\/?[^>]+>/gi, '');
	}
});

/* ============================================= */
 var $break=new Object();
 var $continue=new Object();
 var Enumerable={
 	each:function(iterator){
		//TODO...
	},
	
	all:function(iterator){
	
	},
	
	any:function(iterator){
		
	},
	collect:function(iterator){
		
	},
	detect:function(iterator){
		
	},
	findAll:function(iterator){
		
	}
 }
 
 

 /* =========================================== */
//Array object
var $A=Array.from=function(iterable){
	if(!iterable) return [];
	if(iterable.toArray){
		return iterable.toArray();
	}else{
		var results=[];
		for(var i=0;i<iterable.length;i++){
			results.push(iterable[i]);
		}
		return result;
	}
}

Object.extend(Array.prototype,Enumerable);

Array.prototype._reverse=Array.prototype.reverse;

Object.extend(Array.prototype,{
	_each:function(iterator){
		for(var i=0;i<this.length;i++){
			iterator(this[i]);
		}
	}
});


/* ============================================ */
//TODO
var Hash={
	
}

function $H(object){
	
}
/* ============================================ */
//TODO
ObjectRange = Class.create();
Object.extend(ObjectRange.prototype, Enumerable);
Object.extend(ObjectRange.prototype,{
	initialize:function(start,ends,exclusive){
		
	},
	
	_each:function(iterator){
		
	},
	include:function(value){
		
	}
});

var $R=function(start,end,exclusive){
	return new ObjectRange(start,end,exclusive);
}
/* =============================================== */

//TODO
var Ajax={
	
}

/* ============================================== */
var Form={
	
	
}

Form.Element={
	serialize:function(element){
		element=$(element);
		var method=element.tagName.toLowerCase();
		var parameter=Form.Element.serialize[method](element);
		
	},
}
