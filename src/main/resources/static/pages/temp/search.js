if(!searchPage || typeof searchPage == undefined  ){
	var searchPage={};
}
searchPage.grid='dgser';

searchPage.vars={
		nameFilds:[{id:'com',name:'公司名称'},{id:'age',name:'年龄'}],
		actionFields:[{id:'e',name:'等于'},{id:'b',name:'大于'},{id:'s',name:'小于'},{id:'c',name:'包含'}],
		reFields:[{id:'OR',name:'OR'},{id:'And',name:'And'}]
};

searchPage.nameEditor={
		 type:'combobox',
		 options:{
		 valueField:'id',
		 textField:'name',
		 data:searchPage.vars.nameFilds,
		 required:true,
		 onSelect:function(){
			alert($(this).combobox("getValue")); 
			
		 }
		 }
	 };

searchPage.actionEditor={
		 type:'combobox',
		 options:{
		 valueField:'id',
		 textField:'name',
		 data:searchPage.vars.actionFields,
		 required:true
		 }
	 };

searchPage.strEditor={
		type:'text',
};

searchPage.DateEditor={
		type:'datebox',
};

searchPage.reEditor={
	 type:'combobox',
	 options:{
	 valueField:'id',
	 textField:'name',
	 data:searchPage.vars.reFields,
	 required:true
	 }
};


searchPage._init=function(){
	var opts={
			toolbar: [
			    {
				 iconCls: 'icon-remove',
				 handler: function(){
					 getString();
				 }
			   },
			   {
					 iconCls: 'icon-save',
					 handler: function(){}
			  },{
					 iconCls: 'icon-add',
					 handler: function(){
						 $('#'+searchPage.grid).edatagrid("addRow");
					 }
			 }
			  
			],
			columns : [searchPage.gridColumns],
			fitColumns : true,
			pagination : false,
			rownumbers : true,
			striped : true,
			idField:'paraName'
			
	};
	var grid=$('#'+searchPage.grid).edatagrid(opts);
};

searchPage.gridColumns = [
{
	field : 'paraName',
	hidden:true
},{
	title : "字段名字",
	field : 'title',
	width : 60,
	align : "center",
	editor:searchPage.nameEditor
}, {
	title : "条件",
	field : 'opt',
	width : 60,
	align : "center",
	editor:searchPage.actionEditor
},{
	title : "值",
	field : 'value',
	width : 60,
	align : "center",
	editor: "text"
},{
	title : "关系",
	field : 'relation',
	width : 60,
	align : "center",
	editor:searchPage.reEditor
}
];


$(function(){
	searchPage._init();
});

function getString(){
	//$('#'+searchPage.grid).edatagrid('acceptChanges');
	var  rows=$('#'+searchPage.grid).edatagrid('getRows');
	alert(rows.length);
	alert(rows[0].paraName);
}