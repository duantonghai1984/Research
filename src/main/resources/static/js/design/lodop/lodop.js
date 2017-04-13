var LodopActive = (function(){

	var _embedHtml = '<object  id="LODOP_OB" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width=0 height=0>'
			+ '<embed id="LODOP_EM" name="LODOP_EM" type="application/x-print-lodop" width=0 height=0></embed>';
	
	var _lodop = null;

	function getLodop(oOBJECT, oEMBED) {
		var strHtmInstall = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='http://mtsoftware.v053.gokao.net/samples/install_lodop32.zip'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
		var strHtmUpdate = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='http://mtsoftware.v053.gokao.net/samples/install_lodop32.zip'>执行升级</a>,升级后请重新进入。</font>";
		var strHtm64_Install = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='http://mtsoftware.v053.gokao.net/samples/install_lodop64.zip'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
		var strHtm64_Update = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='http://mtsoftware.v053.gokao.net/samples/install_lodop64.zip'>执行升级</a>,升级后请重新进入。</font>";
		var strHtmFireFox = "<br><br><font color='#FF00FF'>注意：<br>1：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它。";
		var LODOP = oEMBED;
		try {
			if (navigator.appVersion.indexOf("MSIE") >= 0)
				LODOP = oOBJECT;
			if ((LODOP == null) || (typeof (LODOP.VERSION) == "undefined")) {
				if (navigator.userAgent.indexOf('Firefox') >= 0)
					document.documentElement.innerHTML = strHtmFireFox
							+ document.documentElement.innerHTML;
				if (navigator.userAgent.indexOf('Win64') >= 0) {
					if (navigator.appVersion.indexOf("MSIE") >= 0)
						document.write(strHtm64_Install);
					else
						document.documentElement.innerHTML = strHtm64_Install
								+ document.documentElement.innerHTML;
				} else {
					if (navigator.appVersion.indexOf("MSIE") >= 0)
						document.write(strHtmInstall);
					else
						document.documentElement.innerHTML = strHtmInstall
								+ document.documentElement.innerHTML;
				}
				return LODOP;
			} else if (LODOP.VERSION < "6.1.4.5") {
				if (navigator.userAgent.indexOf('Win64') >= 0) {
					if (navigator.appVersion.indexOf("MSIE") >= 0)
						document.write(strHtm64_Update);
					else
						document.documentElement.innerHTML = strHtm64_Update
								+ document.documentElement.innerHTML;
				} else {
					if (navigator.appVersion.indexOf("MSIE") >= 0)
						document.write(strHtmUpdate);
					else
						document.documentElement.innerHTML = strHtmUpdate
								+ document.documentElement.innerHTML;
				}
				return LODOP;
			}
			// *****如下空白位置适合调用统一功能:*********
			//LODOP.SET_LICENSES("", "692989995110115981151055612460", "", "");

			// *******************************************
			return LODOP;
		} catch (err) {
			if (navigator.userAgent.indexOf('Win64') >= 0)
				document.documentElement.innerHTML = "Error:"
						+ strHtm64_Install + document.documentElement.innerHTML;
			else
				document.documentElement.innerHTML = "Error:" + strHtmInstall
						+ document.documentElement.innerHTML;
			return LODOP;
		}
	}
	
	function _addTextToLodop(top,left,width,height,text,fontSize){
		var lodopT=_getLodopD();
		lodopT.ADD_PRINT_TEXT(top,left,width,height,text);
		lodopT.SET_PRINT_STYLEA(0,"FontSize",fontSize);
		lodopT.SET_PRINT_STYLEA(0,"Bold",1);
	}

	function checkLodopActive() {
		return document.getElementById('LODOP_OB')
				|| document.getElementById('LODOP_EM');
	}

	/**
	 * install the lodop active in current html page
	 */
	_install = function() {
		if (!checkLodopActive()) {
			var newdiv = document.createElement("div");
			newdiv.innerHTML = _embedHtml;
			// var parent=document.head || document.body;
			var parent = document.body;
			parent.appendChild(newdiv);
		}
	};

	/**
	 * Get lodop acitive object handler if not install lodop, will install lodop
	 * to current html page
	 */
	_getLodopD = function() {
		if (!_lodop) {
			_lodop = checkLodopActive();
			if (!_lodop) {
				this.install();
			}
			_lodop = getLodop(document.getElementById('LODOP_OB'), document
					.getElementById('LODOP_EM'));
		}
		return _lodop;
	};
	
	function _GetPrinterIDfromJOBID(strJOBID){
		var intPos=strJOBID.indexOf("_");
		if (intPos<0) {return strJOBID;} else {return strJOBID.substr(0,intPos);}
	}
	
	function _getPrintStatus(jobId){
		return _lodop.GET_VALUE('PRINT_STATUS_OK',jobId);
		
	};
	
	function _isInPrintQueue(jobId){
		return _lodop.GET_VALUE('PRINT_STATUS_EXIST',jobId);
	};
	//unit seconds
	function _getUsedTime(jobId){
		return _lodop.GET_VALUE('PRINT_STATUS_SECONDS',jobId);
	};

	/**
	 * clean the printer's print task
	 */
	function _ControlPrinterPURGE(strJOBID){ 
		var lodopT=_getLodopD();
		strPrinterID=_GetPrinterIDfromJOBID(strJOBID); 
		var strResult=lodopT.SET_PRINT_MODE("CONTROL_PRINTER:"+strPrinterID,"PURGE");
		return strResult;
	}
	
	return {
		install:_install,
		getLodopD:_getLodopD,
		addText:_addTextToLodop,
		cleanPrintJobs:_ControlPrinterPURGE,
		isPrintSus:_getPrintStatus,
		isInPrintQueue:_isInPrintQueue,
		getUsedTime:_getUsedTime,
	};
})();


if(typeof Print =='undefined' || !Print){
	var Print={};
}

//Print Job,hold printJob info and listen the job status
Print.PrintJob=function(jobId,lodop){
	this.jobId=jobId;
	this.lodop=lodop;
	this._timeOut=30; //default 30 seconds
	
	var scheduleTaskTime=5000;  //mili seconds
	var timeSpend=0; //seconds
	
	this.getPrintStatus=function(){
		_status=lodop.GET_VALUE('PRINT_STATUS_OK',jobId);
		return _status;
	};
	
	this.isInPrintQueue=function(){
		return lodop.GET_VALUE('PRINT_STATUS_EXIST',jobId);
	};
	//unit seconds
	this.getUsedTime=function(){
		return timeSpend;
		//return lodop.GET_VALUE('PRINT_STATUS_SECONDS',jobId);
	};
	
	// call back function
	this.addHandler=function (handler_fun){
		//check the printer status task
		var timer=setInterval( handler , scheduleTaskTime);;
		 var that=this;

		 function createResult(susFlag){
			 var result=new Print.PrintResult(susFlag,that.getPrintStatus(),that.isInPrintQueue(),that.jobId,that.getUsedTime());
			 return result;
		 }
		 
		function handler(){	
			timeSpend=timeSpend+(scheduleTaskTime/1000);
			//if(that.getPrintStatus()==1 || that.isInPrintQueue()==0){  //pint success
			if( that.isInPrintQueue()==0){	
			    handler_fun(createResult(1));
				clearInterval(timer);
				return ;
			}else{
				if(that.getUsedTime()>that._timeOut){ //timeout
					   clearInterval(timer);
						handler_fun(createResult(0));
						return;
					}
			}
			
			/*
			if(that.isInPrintQueue()==0){  //the job is not in print queue, maybe success or fail
				clearInterval(timer);
				handler_fun(createResult());
				return;
			}else{
				if(that.getUsedTime()>that._timeOut){ //timeout
				   clearInterval(timer);
					handler_fun(createResult());
					return;
				}
			}
			*/
		};
		
	};
};

/**
 * Held the print job result info
 */
Print.PrintResult=function(susFalg,suc,inQue,jobId,usedTime){
	 
	 //if(suc==1 || inQue==0){
	/*
	if(inQue==0){
		 this.suc=1;
	 }else{
		 this.suc=0; 
	 }
	 */
	 this.suc=susFalg;
	 this.sucStat=suc;
	 this.inQue=inQue;
	 this.jobId=jobId;
	 this.timeUsed=usedTime;
};

Print.PrintResult.prototype.toString=function(){
	return this.suc+","+this.sucStat+","+this.inQue+","+this.jobId+","+this.timeUsed;
};

var util={};
util.debug=function(msg){
	if(window.console){
	   window.console.log(msg);	
	}
};

//merger the value from src to dest
util.enxtend=function(dest,src){
	var last={};
	for(var property in dest){
        if(src[property]){
            last[property]=src[property];
        }else{
           last[property]=dest[property]; 
        }
	}
	return last;
};

util.toString=function(data){
	var info='';
	if(data){
	  for(x in data){
		info=info+' '+x+':'+data[x];
	  }
	}
	return info;
};


     
// model 1 print, 0 preview
Print.PrintPage=function(options){
	var defaults={ onSus: '', onFail: '', onOver:'',createPage:'', beforeStart:'',onProgress:'',model:'1',initPage:'',lodop:null,confirmStop:'',onStop:''};
	this.setting=util.enxtend(defaults,options);
	
	var printData=new Array();
	var sucData=new Array();
	var failData=new Array();
	var failJobId=new Array();
	var curInex=-1;
	var _stopPrint=0;  //if 1 stop the print
	var _printting=0;  //是否正在打印，1为正在打印，0为没有打印
	
	var lodop=this.setting.lodop;
	
	if(lodop==null){
		util.debug("user input lodop is null,set it by program");
		lodop=LodopActive.getLodopD();
	}
	
	var that=this;
	
	function isPrintModle(){
	  return that.setting.model==1;	
	}
	
	function isFunction(fun){
		return typeof fun == 'function';
	}
	
	function printSusHandler(jobData){
		if (!isPrintModle()) {
			return;
		}
		var data = that.getPrintData()[curInex];
		sucData.push(data);
		//util.debug("suc data info:"+util.toString(data));
		util.debug("printSusHandler sus index:" + curInex);
		if (isFunction(that.setting.onSus)) {
			that.setting.onSus.call(that, data);
		}
	}
	
	function initPage(){
		if (isFunction(that.setting.initPage)) {
			that.setting.initPage.call(that,lodop);
		}
	}
	
	function printFailHandler(jobData) {
		if (!isPrintModle()) {
			return;
		}
		failJobId.push(jobData.jobId);
		var data = that.getPrintData()[curInex];
		failData.push(data);
		
		//util.debug("fail data info:"+util.toString(data));
		util.debug("printFailHandler failIndex:" + curInex);
		if (isFunction(that.setting.onFail)) {
			that.setting.onFail.call(that, data,jobData);
		}
	}
	
	function printOverHandler(jobData){
		if (!isPrintModle()) {
			return;
		}
		_printting=0;
		if (_stopPrint!=0 && isFunction(that.setting.onStop)){
			that.setting.onStop.call(that);
		}
	  
		/**
		 *  遍历失败的jobId检查状态，如果任务更新失败数据
		 */
		/*
		var newFailData=new Array();
		for(var i=0;i<failJobId.length;i++){
		 if(lodop.GET_VALUE('PRINT_STATUS_OK',failJobId[i])==1){
		    sucData.push(failData[i]);
			util.debug("fail jobId"+ failJobId[i]+"re dected：print success");
		 }else{
			 newFailData.push(failData[i]);
		 }
		}
		failData=newFailData;
		*/
		
		util.debug("printOverHandler suc num:" + sucData.length + ",fail num:" + failData.length);
		if (isFunction(that.setting.onOver)) {
			that.setting.onOver.call(that, sucData, failData,printData);
		}
		
		
		 // if(_stopPrint==0){ //真真打印结束才清理失败任务
				 if (failData.length > 0) {
					util.debug("clean fail jobs:"+LodopActive.cleanPrintJobs(jobData.jobId));
				 }
		//	}
	}
	
	function createPrintPage(){
		//init page size, print model need set very page, review modle only first time need
		if (isPrintModle()) {
			initPage();
		} else {
			if (curInex == 0) {
				initPage();
			}/*else{
				LODOP.NewPage();
			}*/
		}
		if(isFunction(that.setting.createPage)){
			var data=that.getPrintData()[curInex];
			that.setting.createPage.call(that,data,lodop,curInex);
		}
		if(isPrintModle()){
		  lodop.SET_PRINT_MODE("CATCH_PRINT_STATUS",true);
		}
	}
	
	function printJobHandler(data){
		util.debug("printJobHandler:"+data);
		if(data.suc==1){
			printSusHandler(data);
		}else{
			printFailHandler(data);
		}

		if(hasNext() && _stopPrint==0){ //print next
			printNextPage();
		}else{ 
			printOverHandler(data); //print over
		}
	}
	
	function printNextPage(){
		if(hasNext()){
			moveNext();	
		}
		createPrintPage();
		if(isPrintModle()){ //print model
			var jobId=lodop.PRINT();
			util.debug("jobId:"+jobId+ " curIndex:"+curInex);
			new Print.PrintJob(jobId,lodop).addHandler(printJobHandler);
		}else{ //only preview 
			while(hasNext()){
				moveNext();
				lodop.NewPage();
				util.debug('add new page:'+curInex);
				createPrintPage();
			}
			lodop.PREVIEW();
		}
	}
	
	function printProgress() {
		if (!isPrintModle()) {
			return;
		}
		if (isFunction(that.setting.onProgress)) {
				that.setting.onProgress.call(that, failData.length,sucData.length,printData.length);
				if((failData.length+sucData.length)<printData.length){ //if 100%,stop
				   setTimeout(printProgress, 200);
				}
		}
	}
	
	function moveNext(){
		curInex=curInex+1;
	};
	
	function hasNext(){
	  return curInex<printData.length-1;	
	};
	
	this.getCurIndex=function(){
	   return curInex;
	};
	
	this.getPrintData=function(){
	    	return printData;
	};
	
	this.getSusData=function(){
		return sucData;
	};
	
	this.getFailData=function(){
		return failData;
	};
	
	this.setPrintData=function(data){
		if(data instanceof Array){
		  printData=data;
		}else{
			printData.push(data);
		}
	};
	
	/**
	 * return
	 * 0  success
	 * 1  no print data
	 * 2  has printed already
	 */
	this.startPrint=function(){
		util.debug("stopPrintValue:"+_stopPrint);
		if(_stopPrint==0){ //当前是打印模式不是从停止中恢复
		//can load print data
		  if(isFunction(that.setting.beforeStart)){
			util.debug("call function beforeStart");
			that.setting.beforeStart.call(that);
		  }
		}
		_stopPrint=0;
		if(printData.length<1){
		  throw new Error("没有数据可打印，请检查");
			//return 1;
		}
		
		if(!hasNext()){
			throw new Error("你已经打印一遍了，请不要重复打印");
			//return 2
		}
		
		printNextPage();
		printProgress();
		_printting=1;
		//return 0;
	};
	
	this.setOption=function(key,value){
		if(key && value){
			this.setting[key]=value;
		}
	};
	
	this.isStop=function(){
		return _stopPrint==1;
	};

	this.stopPrint=function(){
		if(_printting!=1){
			util.debug("现在没有任务在打印，请检查");
			return false;
		}
		
		
		  if(isFunction(that.setting.confirmStop)){
			 var re=that.setting.confirmStop.call(that);
			 util.debug("_stopPrint confirmStop re:"+re);
			 if(re){
				 _stopPrint=1; 
			 }else{
				 _stopPrint=0;
			 }
		  }else{
			  _stopPrint=1;
		  }
		  return true;
	};
	
	this.setPageSize=function(top,left,width,height,name){
		lodop.PRINT_INITA(top,left,width,height,name);
	};
};  //end print page




/**
 * use guide
 * print model:
var printPage=new Print.PrintPage({
 beforeStart : function(){
    var data=new Array();
    for(var i=0;i<4;i++){
      data.push("duant"+i);
    }
    this.setPrintData(data);
 },
 createPage: cratePage,
 onSus: function(data){
     util.debug('sus:'+data);
  },
 onFail: function(data,jobData){
   util.debug('fail'+data);
 },
 
 onProgress:funtion(value){
 
 },
 initPage: function(lodop){
   lodop.PRINT_INITA("0cm","0cm","23.07cm","12.7cm","");
 }
});

printPage.startPrint();

function cratePage(data,lodop,index){
	lodop.ADD_PRINT_TEXT("2.97cm","10.5cm","7.14cm","1.59cm","shanghai pudong");
	lodop.SET_PRINT_STYLEA(0,"FontSize",12);
	lodop.SET_PRINT_STYLEA(0,"Bold",1);
}

preview model:

var printPage=new Print.PrintPage({
 beforeStart : function(){
    var data=new Array();
    for(var i=0;i<4;i++){
      data.push("duant"+i);
    }
    this.setPrintData(data);
 },
 createPage: cratePage,
 initPage: function(lodop){
   lodop.ADD_PRINT_TEXT("2.1cm","10.5cm","3.15cm","0.66cm","duan tonghai");
 }
});

printPage.startPrint();
*/

