if(typeof common =='undefined' || !common){
	var common={};
}

common.util={};

common.util.debug=function(msg){
	if(window.console){
		window.console.log(msg);
	}
};

/**
 * 判断是不是函数
 */
common.util.isFunction=function(fun){
	return typeof fun == 'function';
};

/**
 * 返回给定对象的属性值
 */
common.util.toString=function(data){
	var info='';
	if(data){
	  for(x in data){
		info=info+' '+x+':'+data[x];
	  }
	}
	return info;
};

/**
 * 去除前导0
 */
common.util.removeZeroPre=function(code){
	if(isNaN(code)){
		throw new Error("输入的不是数字");
	}
	if(parseInt(code)==0){
		return '0';
	}
	var lastZIndex=0;
	var startCode1=code;
	for(;lastZIndex<startCode1.length-1;lastZIndex++){ //得到前导0
		if(startCode1.charAt(lastZIndex)!='0'){
			break;
		}
	}
	
	if(lastZIndex>0){
		startCode1=startCode1.substring(lastZIndex);
	}
	return startCode1;
};

/**
 * 获取end,start之间的差
 */
common.util.subtract=function(end,start){
	var maxSupLen=15; //最大int支持位数
	
	if(isNaN(end)||isNaN(start)){
		throw new Error("参数不是数字");
	}
	var end1=common.util.removeZeroPre(end);
	var start1=common.util.removeZeroPre(start);
	
	if(end1.length<maxSupLen && start1.length<maxSupLen ){
		return String(parseInt(end1)-parseInt(start1));
	}else{
		var min=Math.min(end1.length<maxSupLen,start1.length);
		var stat1Len=start1.length;
		var end1Len=end1.length;
		var gap=parseInt(end1.substring(end1Len-min,end1Len))-parseInt(start1.substring(stat1Len-min,stat1Len));
		if(gap>=0){
			return String(end1.substring(0,min)+gap+'');
		}else{
			return String('-'+start1.substring(0,min)+Math.abs(gap));
		}	
	}
};




common.obj={};

/**
 * 一个提供类型java  iterator的类
 */
common.obj.iterator = function(data) {
	if (!(data instanceof Array)) {
		throw new Error("need array");
	}
	var _data = data;

	var index = -1;
	this.next = function() {
		index = index + 1;
		return _data[index];
	};

	this.getIndex = function() {
		return index;
	};

	this.back = function() {
		index = index - 1;
		return _data[index];
	};

	this.hasNext = function() {
		return (index < _data.length - 1);
	};
	
	this.hasBack=function(){
		return index>-1;
	};
	
	this.getSize=function(){
		return _data.length;
	};

	this.get=function(index){
		return _data[index];
	};
	
	this.getCurrent=function(){
		return _data[index];
	};
	
	this.getAll=function(){
		return _data;
	};
	
	this.backOne=function(){
		index = index - 1;
	};
};

common.obj.iterator.prototype = {
	next : function() {
		return this.next();
	},
	back:function(){
		return this.back();
	},
	hasNext:function(){
		return this.hasNext();
	},
	hasBack:function(){
		return this.hasBack();
	},
	getSize:function(){
		return this.getSize();
	},
	get:function(index){
		return this.get(index);
	},
	getCurrent:function(){
		return this.getCurrent();
	},
	getAll:function(){
		this.getAll();
	},
	revertOne:function(){
		this.backOne();
	}
};


common.obj.NumberCode=function(startCode,endCode){
	var _lastStartCodeCur=0; //最后一个编号的坐标
	
	var _subIndex=10;
	var _startCodePre=""; 
	var _maxNum=0;
	var _numUsed=0;
	
	var _zeros='00000000000000';
	
	if(arguments.length!=2){
		throw new Error("must have two number argument,but you have "+argLength);
	}
	
	function initCodeArray(){
		var startCode1=startCode;
		var endCode1=endCode;
				
		if(isNaN(startCode1)|| isNaN(endCode1)){
			throw new Error("argument is not number");
		}
		
		startCode1=common.util.removeZeroPre(startCode1);
		endCode1=common.util.removeZeroPre(endCode1);
		_maxNum=parseInt(common.util.subtract(endCode1,startCode1))+1;
		invoiceUtil.debug('maxNum:'+_maxNum);
		
		if(_maxNum<0){
			throw new Error("startCode:"+startCode+" must less than endCode:"+endCode);
		}
		invoiceUtil.debug("after remove 0 startCode:"+startCode1);
		
		if(startCode1.length<15){  //超过15位截取
			_subIndex=0;
			_startCodePre='';
		}else{
		  _startCodePre=startCode1.substring(0,_subIndex);
		   startCode1=startCode1.substring(_subIndex);
		}
		
		invoiceUtil.debug("final startCode:"+startCode1);
		_lastStartCodeCur=parseInt(startCode1)-1;
		
		
		_numUsed=0;
	}
	
	this.getNext=function(){
		_lastStartCodeCur=_lastStartCodeCur+1;
		_numUsed=_numUsed+1;
		if(_numUsed>_maxNum){
			throw new Error("out of range:"+endCode);
		}
		var nextNum=new String( _startCodePre+_lastStartCodeCur);
		var gap=String(startCode).length-nextNum.length;
		if(gap>0){
			nextNum=_zeros.substring(0, gap)+nextNum;
		}
		return nextNum;
	};
	
	this.reInit=function(){
		initCodeArray();
	};
	
	initCodeArray();
};