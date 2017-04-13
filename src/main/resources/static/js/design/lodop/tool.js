var LodopActive = (function() {

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
			LODOP.SET_LICENSES("", "692989995110115981151055612460", "", "");

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

	/**
	 * 清理打印机上未完成的任务
	 */
	function _ControlPrinterPURGE(strJOBID){ 
		var lodopT=_getLodopD();
		strPrinterID=GetPrinterIDfromJOBID(strJOBID); 
		var strResult=lodopT.SET_PRINT_MODE("CONTROL_PRINTER:"+strPrinterID,"PURGE");
		return strResult;
	}
	
	return {
		install:_install,
		getLodopD:_getLodopD,
		addText:_addTextToLodop,
		cleanPrintJobs:_ControlPrinterPURGE
	}
})();

//打印job对象，保存打印任务信息
LodopActive.PrintJob=function(jobId,lodop){
	
	this.jobId=jobId;
	this.lodop=lodop;
	this._timeOut=30; //default 30 seconds
	
	this.getPrintStatus=function(){
		_status=lodop.GET_VALUE('PRINT_STATUS_OK',jobId);
		return _status;
	};
	
	this.isInPrintQueue=function(){
		return lodop.GET_VALUE('PRINT_STATUS_EXIST',jobId);
	}
	
	//unit seconds
	this.getUsedTime=function(){
		return lodop.GET_VALUE('PRINT_STATUS_SECONDS',jobId);
	}
	
	/*
	* 回调函数
    */
	this.addHandler=function (handler_fun){
		 var timer;
		 var that=this;
		 
		 function createResult(){
			 /*
			 var obj=new Object();
			 obj.success=that.getPrintStatus();
			 obj.isInqueue=that.isInPrintQueue();
			 obj.jobId=that.jobId;
			 obj.timeUsed=that.getUsedTime();
			 */
			 var result=new LodopActive.PrintResult(that.getPrintStatus(),that.isInPrintQueue(),that.jobId,that.getUsedTime());
			 return result;
		 }
		 
		function handler(){
			if(that.getPrintStatus()==1){  //如果打印成功
				handler_fun(createResult());
				clearInterval(timer);
				return ;
			}
			
			if(that.isInPrintQueue()==0){  //已经不在打印队列，可能成功也可能失败
				clearInterval(timer);
				handler_fun(createResult());
				return;
			}else{
				if(that.getUsedTime()>that._timeOut){ //超时
				   clearInterval(timer);
					handler_fun(createResult());
					return;
				}else{
					//setTimeout( handler , 5000); //继续检查状态
				}
			}
		};
		//启动打印状态检查
	    timer=setInterval( handler , 5000);
		
	};
};

LodopActive.PrintResult=function(suc,inQue,jobId,usedTime){
	 this.suc=suc;
	 this.inQue=inQue;
	 this.jobId=jobId;
	 this.timeUsed=usedTime;
};

LodopActive.PrintResult.prototype.toString=function(){
	return this.suc+","+this.inQue+","+this.jobId+","+this.timeUsed;
};



