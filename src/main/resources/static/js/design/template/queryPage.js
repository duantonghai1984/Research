var queryPage=(function(options){
	
	var defaults={
			dateGridId:'dataTab',
			formId:'',
			easyuiOpt:'',
			queryUrl:'',
			init:'',
			validateParas:''
	};
	
	$.extend(defaults,options);
	
	if(!defaults.formId || defaults.formId==''){
		throw new Error("no formId");
	}
	
	if(!defaults.queryUrl || defaults.queryUrl==''){
		throw new Error("no queryUrl");
	}
	
	if(!defaults.easyuiOpt || defaults.easyuiOpt==''){
		throw new Error("no easyuiOpt");
	}
	
	function _initDataGrid () {
		notespayCommon.createDataGrid(webPage.dateGridId, defaults.easyuiOpt);
	}
	
	function _getFromParas() {
		if (!notespayCommon.validateForm(webPage.formId)) {
			return null;
		}
		var prarams = notespayCommon.getformParams(webPage.formId);
		
		if(typeof defaults.validateParas == 'function'){
			var valid=defaults.validateParas(_getFromParas());
			if(!valid){
				return null;
			}
		}
		return prarams;
	}
	
	
	function _initPage(){
		if(typeof defaults.init == 'function'){
			defaults.init();
		}
		_initDataGrid();
	}
	
	function _pageSearch(){
		var data = _getFromParas();
		if (!data) {
			return;
		}
		var gridId='#' + defaults.dateGridId;
		$(gridId).datagrid('options').url = defaults.queryUrl;
		$(gridId).datagrid('load', data);
		invoiceUtil.setPagination(defaults.dateGridId, false);
	}

	return function() {
		_initPage();
		
		this.pageSearch = function() {
			_pageSearch();
		};
		
		this.getParas=function(){
			return _getFromParas();
		};
	};
})(options);




