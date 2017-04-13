if(typeof invoiceUtil == undefined || !invoiceUtil ){
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
	var pattern=/^[0-9]*[1-9][0-9]*$/;
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

Array.prototype.clone=function(){
	return this.slice(0);
};

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
		return nextNum;
	};
	
	this.reInit=function(){
		initCodeArray();
	};
	
	initCodeArray();
};