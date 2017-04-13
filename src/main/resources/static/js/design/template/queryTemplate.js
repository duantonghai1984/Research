if (!webPage || typeof webPage == undefined) {
	var webPage = {};
}

webPage.dateGridId = 'dataTab';

webPage.formId = "searchForm";

webPage.pageSize = 50;

webPage.pageList = [ 20, 50, 100 ];

webPage.queryUrl = $("#base").val() + '/notesPay/searchNotesPayPgA.action';

webPage.exportUrl=notespayCommon.buildUrl('/notesPay/exportExcel.action?');

webPage.gridColumns = [ {
	title : "单据编号",
	field : 'code',
	width : 80,
	align : "center"
}, {
	title : '应付含税金额',
	field : 'taxAmount',
	width : 50,
	align : "center",
	formatter : function(value, rowData, rowIndex) {
		return String(value).currency();
	}
}, {
	title : '应付税额',
	field : 'tax',
	width : 50,
	align : "center",
	formatter : function(value, rowData, rowIndex) {
		return String(value).currency();
	}
} ];

webPage._initDataGrid = function() {
	notespayCommon.createDataGrid(webPage.dateGridId, {
		singleSelect : true,
		columns : [ webPage.gridColumns ],
	});
};

webPage._getFromParas = function() {
	if (!notespayCommon.validateForm(webPage.formId)) {
		return null;
	}
	var prarams = notespayCommon.getformParams(webPage.formId);
	
	if(webPage._validateFormParas){
		return prarams;
	}else{
		return null;
	}
};


webPage._validateFormParas=function(params){
 //对数据做合法性校验	
	return true;
};

webPage._initPage=function(){
	//初始化变量页面参数等等
	
	webPage._initDataGrid();
};
/**
 * 分页查询
 */
function pageSearch() {
	var data = webPage._getFromParas();
	if (!data) {
		return;
	}
	$('#' + webPage.dateGridId).datagrid('options').url = webPage.queryUrl;
	$('#' + webPage.dateGridId).datagrid('load', data);
	invoiceUtil.setPagination(webPage.dateGridId, false);
}

function exportExcel() {
	var prarams = webPage._getFromParas();
	if (!prarams) {
		return false;
	}
	var url = webPage.exportUrl;
	for (x in prarams) {
		url = url + x + "=" + prarams[x] + "&";
	}
	var nw = window.open(url, "");
};


$(function() {
	webPage._initPage();
});
