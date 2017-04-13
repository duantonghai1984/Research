if(!invoiceUtil || typeof invoiceUtil == undefined  ){
	var invoiceUtil={};
}

invoiceUtil.subtract=function(str1, str2) {
	// alert(a+"-"+b+"="+(a-b));
	// 减法结果
	var c = "";
	// 借位标志
	var flog = true;
	// 被减数和减数长度
	var i = str1.length - 1;
	var j = str2.length - 1;
	if (j > i) {
		var c = '-' + invoiceUtil.subtract(str2, str1);
		return c;
	}
	if (j == i && str1 < str2) {
		var c = '-' + invoiceUtil.subtract(str2, str1);
		return c;
	}
	for (; i >= 0; i--, j--) {
		// 获取减数低位
		var charb = 0;
		if (j >= 0) {
			charb = str2.charAt(j);
		}

		// 获取被减数低位
		var chara = str1.charAt(i);
		// 如果借位
		if (flog != true) {
			// 如果被借位为0
			if (chara == 0) {
				// 再借一然后减一
				flog = false;
				chara = 9;
			} else if ((chara - 1) < charb) {
				// 如果不够减借一
				flog = false;
				chara = 1 + chara - 1;
			} else {
				chara = chara - 1;

				flog = true;
			}
		}
		// 低位相减
		if (chara >= charb) {
			c = '' + (chara - charb) + c;
			// alert('够减'+c);
		} else {
			// 如果不够减借位
			var x = 1 + chara - charb;
			// alert(x);
			c = '' + x + c;
			flog = false;
			// alert('不够减'+c);
		}
	}
	// 字符串
	return c;
};

invoiceUtil.isNum=function(n){
	var pattern=/^[0-9]*[0-9][0-9]*$/;
	var flag = pattern.test(n);
	if(flag){
		return true;
	}else{
		return false;
	}
};


invoiceUtil.checkGreatNum=function(m,n){
	try{
		if(m>n){
			return 1;
		}else{
			return -1;
		}
	}catch(e){
		return 0;
	}
};

invoiceUtil.debug=function(msg){
	if(window.console){
		window.console.log(msg);
	}
};

window.debug=function(msg){
	if(window.console){
		window.console.log(msg);
	}
};

/*Array.prototype.clone=function(){
	return this.slice(0);
};*/



invoiceUtil.NumberCode=function(startCode,endCode){
	
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
		
		startCode1=removeZeroPre(startCode1);
		endCode1=removeZeroPre(endCode1);
		_maxNum=parseInt(invoiceUtil.subtract(endCode1,startCode1))+1;
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
	
	function removeZeroPre(code){
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
		return String(nextNum);
	};
	
	this.reInit=function(){
		initCodeArray();
	};
	
	initCodeArray();
};

invoiceUtil.removeZeroPre=function(code){
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
invoiceUtil.classExtend=function(subClass, superClass) {
    var F = function() {};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    subClass.superClass = superClass;
    if(superClass.prototype.constructor == Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
};



invoiceUtil.iterate = function(data) {
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

invoiceUtil.iterate.prototype = {
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


invoiceUtil.setPagination=function(id,isInit,_pageSize,_pageList){
	var pageSize=50;
	var pageList=[ 20, 50, 100 ];
	var pg = $('#'+id).datagrid('getPager');
	
	var ops=$('#'+id).datagrid('options');
	if(_pageSize){
		pageSize=_pageSize;
	}else if(ops.pageSize){
		pageSize=ops.pageSize;
	}
	
	if(_pageList){
		pageList=_pageList;
	}else if(ops.pageList){
		pageList=ops.pageList;
	}
	
	if (isInit) {
		$(pg).pagination({
			pageSize : pageSize,// 每页显示的记录条数，默认为10
			pageList : pageList,// 可以设置每页记录条数的列表
			beforePageText : '第',// 页数文本框前显示的汉字
			afterPageText : '页    共 {pages} 页',
			displayMsg : '当前显示 0 - 0 条记录   共 0 条记录'
		});
	} else {
		$(pg).pagination({
			pageSize : pageSize,// 每页显示的记录条数，默认为10
			pageList : pageList,// 可以设置每页记录条数的列表
			beforePageText : '第',// 页数文本框前显示的汉字
			afterPageText : '页    共 {pages} 页',
			displayMsg : '当前显示 {from} - {to} 条记录   共 {total} 条记录'
		});
	}
};

/**
 * 常用的easyui column format
 */
invoiceUtil.easyui={};
invoiceUtil.easyui.formatter=new Array();
invoiceUtil.easyui.formatter["time"] = function(value,rowData,rowIndex,timeFormat){
	  var formatStr='';
	  if(timeFormat){
		  formatStr=timeFormat;
	  }else{
		  formatStr='yyyy-MM-dd';
	  }
	  if(value!=null){
		  return new Date(value.time).format(formatStr);
	  }else{
		  return "";
	  }	
};

//金额输出处理
invoiceUtil.transformAmount=function(value) {
	 if(!value  || value ==''){
			 return '';
		 }
	 
	var v = parseFloat(value);
	var value1 = v.toFixed(2);
	result = value1.replace(/(\d{1,3})(?=(?:\d{3})+(?:\.))/g,'$1,');
	return result;
};

String.prototype.currency=function(){
	return invoiceUtil.transformAmount(this);
};

String.prototype.rate=function(){
	if(isNaN(this)){
		return this;
	}
	var rate=parseFloat(this);
	if(rate<1){
		rate=rate*100;
	}
	return rate+"%";
};