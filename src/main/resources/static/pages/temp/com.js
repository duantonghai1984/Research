if(!searchPage || typeof searchPage == undefined  ){
	var searchPage={};
}

searchPage.optType=['string','date','num','enum'];

searchPage.vars={
		nameFilds:[],  
		reFields:[{id:'OR',name:'OR'},{id:'AND',name:'AND'}]
};


searchPage.operation={
    strOpts:[
     {id:"=",name:"="},
     {id:"!=",name:"!="},
     {id:"like",name:"包含"}
   ],
   enumOpts:[
     {id:"=",name:"="},
     {id:"!=",name:"!="},
   ],
   
   dateOpts:[
    {id:"=",name:"="},
    {id:"!=",name:"!="},
    {id:">",name:">"},
    {id:">=",name:">="},
    {id:"<",name:"<"},
    {id:"<=",name:"<="}
  ],
  numOpts:[
     {id:"=",name:"="},
     {id:"!=",name:"!="},
     {id:">",name:">"},
     {id:">=",name:">="},
     {id:"<",name:"<"},
     {id:"<=",name:"<="}
  ],
  

    allOpts:function() {

        if(!this.obj){
           this.obj=new Array(); 
        }
        that = this;
        
        function getOpts(obj) {
            var all=[];
            all=all.concat(that.strOpts,that.enumOpts,that.dateOpts,that.numOpts);
            debug("all length:"+all.length);
            for (var i=0;i<all.length;i++) {
                obj[all[i].id] = all[i].name;
            }
            return obj;
        }
        if(!this.obj['=']){
            this.obj=getOpts(this.obj); 
        }
         return this.obj;
    }

    
};

var comSearch=(function(){
    this.setting={containerId:'',fields:[],key:'',userId:'',getProjsUrl:'',deletePro:'',saveProUrl:''};
    var that=this;
	
	var _editIndex = undefined;  //当前编辑行的index
    var _curRowIndex=-1;      //查询条件当前index
	var _proCurRowIndex=-1;   //方案当前index
	var _loadProIndex=-1;     //当前被加载的方案index, 双击时加载方案
	
    var _localVars={};  //本地变量，常量存放点
	
	var fiel_hidden=true;   //指示隐藏字段
	
	window.debug=function(msg){
	 if(window.console){
		window.console.log(msg);
	 }
    };
    
	_localVars.nameEditor = createEditor('combobox', {
		data : searchPage.vars.nameFilds,
		onSelect : function() {
			debug("nameEditor:"+$(this).combobox('getValue')+","+_curRowIndex+","+_editIndex);
			var filedInfo = getData($(this).combobox('getValue'));
			var rowData = new Object();
			rowData.id = filedInfo.id;
			rowData.value = null;
			rowData.type = filedInfo.type;
			var comboboxValues = filedInfo.values;
			restorLineData(_curRowIndex, rowData, null,comboboxValues);
		}
	});
    
    _localVars.actionEditor=createEditor('combobox',{
    	 data:searchPage.operation.numOpts,
		 onSelect : function() {
			 var optEditor=getGridDitor(_curRowIndex,'opt');
			 if(optEditor){
			   optEditor.target.val($(this).combobox('getValue'));
			 }
		}
    });
    
    _localVars.reEditor=createEditor('combobox',{data:searchPage.vars.reFields});
    
    _localVars.strEditor={type:'text',options:{required:true} };
    
    _localVars.toolBar = [
      { iconCls : 'icon-remove',
    	handler : function() {
    		getGrid().datagrid('deleteRow',_curRowIndex);
    	} },
      { iconCls : 'icon-save',
    	handler : function() {
    		getString(); 
      } },
      { iconCls : 'icon-add',
		handler : function() {
				if (endEditing()) {
					    getGrid().datagrid('appendRow', {});
						_editIndex = 	getGrid().datagrid('getRows').length - 1;
						//_curRowIndex = _editIndex;
						_curRowIndex=_curRowIndex+1;
						getGrid().datagrid('selectRow',_editIndex)
						.datagrid('beginEdit',_editIndex);
					}else{
					    $.messager.alert('提示',"当前查询条件不完整，请检查");
					}
				debug("appendRow:"+_curRowIndex+","+_editIndex);
		
				}
      }];
                  	
    

    _localVars.gridColumns = [
	{
	 field : 'ck',
	 checkbox:true
	},{
    	title : "参数名",
    	field : 'id',
    	width:20,
		hidden:fiel_hidden,
    	editor: _localVars.strEditor
    },
    {
    	title : "类型",
    	field : 'type',
    	width:10,
		hidden:fiel_hidden,
    	editor: _localVars.strEditor
    },
    {
    	title : "实际值",
    	field : 'value',
    	width:20,
		hidden:fiel_hidden,
    	editor: _localVars.strEditor
    },{
    	title : "操作符",
    	field : 'opt',
    	width:10,
		hidden:fiel_hidden,
    	editor: _localVars.strEditor
    },
    {
    	title : "字段名字",
    	field : 'name',
    	width : 50,
    	align : "center",
    	formatter:function(value,row,index){
            return findParamName(row.id);;
          },
    	editor:_localVars.nameEditor
    }, {
    	title : "条件",
    	field : 'optStr',
    	width : 30,
    	align : "center",
    	formatter:function(value,row,index){
    	           debug('row opt:'+row.opt);
    	           if(row.opt){
    			       return findOpt(row.opt);
    				}else{
					   return "";
					}
    	          
          },
    	editor:_localVars.actionEditor
    },{
    	title : "值",
    	field : 'valStr',
    	width : 30,
    	align : "center",
    	required:true,
    	formatter:function(value,row,index){
            var res=findParamValuesName(row.id,row.value);
    		if(res){
    		    return res;
    		  }else{
    		    return row.value;
    		  }
          },
          editor: _localVars.strEditor
    },{
    	title : "关系",
    	field : 'relation',
    	width : 20,
    	align : "center",
    	editor:_localVars.reEditor
    }
    ];
    
    _localVars.gridOpts={
	        toolbar: _localVars.toolBar,
			columns : [_localVars.gridColumns],
			fitColumns : true,
			pagination : false,
			rownumbers : true,
			singleSelect: true,
			selectOnCheck:true,
			checkOnSelect:true,
			striped : true,
			idField:'id',
			onSelect:function(rowIndex,rowData){
			 _curRowIndex = rowIndex;
			},
			onDblClickRow: function (index, rowData) {
				debug("onDblClickRow before:"+_curRowIndex+","+_editIndex+",index:"+index);
		    	if (_editIndex != index) {
		    		if (endEditing()) {
		    			$(this).datagrid('selectRow', index).datagrid('beginEdit', index);
		    			_editIndex = index;
						_curRowIndex = index;
						// 还原值
						debug("onDblClickRow:"+rowData.id);
						if (rowData.id) {
							var comboboxValues = getData(rowData.id).values;
							restorLineData(index, rowData, rowData.value, comboboxValues);
						}
		    		} else {
		    			$(this).datagrid('selectRow', _editIndex);
						 $.messager.alert('提示',"当前查询条件不完整，请检查");
		    		}
		    	} else {
		    		
		    	}
				debug("onDblClickRow after:"+_curRowIndex+","+_editIndex+",index:"+index);
		    }
			
	};
	
	_localVars.grid2Opts=[
						{  title : "自定义查询名称", field : 'name', align : "center", width:190,
							formatter:function(value,row,index){
									return value;
							}
						}
	];
	
	_localVars.grid2Opts={
	        toolbar:[ { iconCls : 'icon-remove',
						handler : function() {
						         var rows=getProjsGrid().datagrid('getRows');
								 debug("before deletePro _proCurRowIndex:"+_proCurRowIndex);
								 if(_proCurRowIndex>=0){
								   deletePro(rows[_proCurRowIndex].id);
								 }
								
						} },
						{ iconCls : 'icon-save',
							handler : function() {  savePro();	 }
						},
						{ iconCls : 'icon-add',
						  handler : function() {  
						            clear();
									_proCurRowIndex=-1; 
									_loadProIndex=-1;
						  }
						}
						],
			columns : [_localVars.grid2Opts],
			//fitColumns : true,
			pagination : false,
			singleSelect: true,
			striped : true,
			idField:'id',
			onClickRow:function(rowIndex,rowData){
			    _proCurRowIndex=rowIndex;
			},
			onDblClickRow:function(rowIndex,rowData){
			    _proCurRowIndex=rowIndex;
				if(rowData.jsonStr){
				  loadData(rowData.jsonStr);
				  _loadProIndex=rowIndex;
				}
			}
	};
  
  
    function restorLineData(index,rowData,initValue,comValues){
		      debug("restorLineData:"+_curRowIndex+","+_editIndex+",index:"+index+" initValue:"+initValue);
		
		     //设置数据类型
				var typeEditor=getGridDitor(_curRowIndex,'type');
				if(typeEditor){
				    typeEditor.target.val(rowData.type);
				  }
			 //设置参数id				
				var idEditor=getGridDitor(_curRowIndex,'id');
				if(idEditor){
				    idEditor.target.val(rowData.id);
				  }
				  
				var nameEditor=getGridDitor(_curRowIndex,'name');
				if(nameEditor){
				    nameEditor.target.combobox('setValue',rowData.id);
				  }
				  
				  
		   //设置值字段的编辑框	
		   var _values=comValues;  //枚举类型的值集合
		   var vs=$('td[field="valStr"]');
			// var f=vs[index+1].childNodes[0].childNodes[0].childNodes[0].childNodes[0];	
			var f=vs[index+1].childNodes[0].childNodes[0];
			 if(f.childNodes[0]){
			     f=f.childNodes[0];
				 if(f.childNodes[0]){
					f=f.childNodes[0];
				 }
			  }
			 removeChilds(f);  //去掉以前的节点内容	
            var div=null;			 
			if(rowData.type=='date'){
					div=$("<input class='easyui-datebox' type='text' />");
					div.appendTo(f);
					div.datebox({
								required:true,
								onSelect:function(){
											   getGridDitor(_curRowIndex,'value')
											   .target.val($(this).datebox('getValue'));
											 }
					   });
					  if(initValue){
					    div.datebox("setValue",initValue);
					 }
					$.parser.parse(div.parent());
			 }else if(_values){
					div=$("<input  type='text' />");
					div.appendTo(f);
					div.combobox({ valueField:'id',
		                                     textField:'name',
											 required:true,
		                                     data:_values,
											 width:'100%',
											 onSelect:function(){
											    getGridDitor(_curRowIndex,'value')
												.target.val($(this).combobox('getValue'));
											 }
											}
										  );
					 if(initValue){
					    div.combobox("setValue",initValue);
					 }
		  }else{
			  div=$("<input  class='easyui-validatebox' data-options='required:true' />");
			  div.appendTo(f);
			  if(initValue){
					   div.val(initValue);
					 }
			  div.bind( "change", function() {
						 getGridDitor(_curRowIndex,'value').target.val($(this).val());
			 });
		  }
		  $.parser.parse(div.parent());
		  
		  
		  //设置opt条件根据选择的字段数据类型
		  var optStrF=$('td[field="optStr"]');
		   var optf=optStrF[index+1].childNodes[0].childNodes[0];
             if(optf.childNodes[0]){
                 optf=optf.childNodes[0];
                 if(optf.childNodes[0]){
                 optf=optf.childNodes[0];
                 }
              }
             removeChilds(optf);  //去掉以前的节点内容  
             
            var data;   
            if(rowData.type=='date'){
               data= searchPage.operation.dateOpts;                      
            }else if(rowData.type=='enum' || _values){
                data= searchPage.operation.enumOpts;
            }else if(rowData.type=='num'){
                data= searchPage.operation.numOpts;
            }else if(rowData.type=='string'){ 
                data= searchPage.operation.strOpts;
            }else{ //默认为数字
               data= searchPage.operation.numOpts; 
            }
            
            var optStrDiv=$("<input  type='text' />");
            optStrDiv.appendTo(optf);
		    optStrDiv.combobox({ valueField:'id',
                                             textField:'name',
                                             required:true,
                                             data:data,
                                            // width:60,
                                             onSelect:function(){
                                                getGridDitor(_curRowIndex,'opt')
                                                .target.val($(this).combobox('getValue'));
                                             }
                                            }
                                          );
                                          
          $.parser.parse(optStrDiv);
          optStrDiv.combobox('setValue',rowData.opt);
          
          /*
           var optStrEditor=getGridDitor(_curRowIndex,'optStr');
            if(optStrEditor){
                    debug("optStrEditor restor optStr value:"+rowData.opt);
                    optStrEditor.target.combobox('setValue',rowData.opt);
            }
          */
          
		}
    
       
     function createEditor(type,options){
    	var def={valueField:'id',textField:'name',required:true};
    	def=$.extend(def,options);
    	return {type:type,options:def};
     }
     
    
	 
	 function isFunction(fun){
		return typeof fun == 'function';
	}
    
	
	function createProPramas(){
	  var params={key:this.setting.key, userId:this.setting.userId };
	  return params;
	}
	
	function validateQuery(queryArray){
	    var cahce=new Array();
	    for(var i=0;i<queryArray.length;i++){
	        if(queryArray[i].relation!='AND'){
	            continue;
	        }
	         var key=queryArray[i].id+queryArray[i].opt;
	         debug("vali:"+cahce[key]+" key:"+key);
	         if(cahce[key]!=undefined){
	             alert("第"+cahce[key]+"行和第"+(i+1)+"行查询条件重复，请检查");
	             return false;
	         }else{
	             cahce[key]=(i+1);
	         }
	    }
	    return true;
	}
	
	function savePro(){
	   debug("savePro start");
	   if(!endEditing()){
		  $.messager.alert('提示',"你还有些输入为空，请检查");
		  return false;
	   }
	   var url=this.setting.saveProUrl;
	   var params=createProPramas();
	   var json=getSearchParms();
	   if(!json || json.length<1){
		  $.messager.alert('提示',"没有查询条件，请输入查询条件");
		  return false;
	   }
	   if(!validateQuery(json)){
	       return false;
	   }
	   params.jsonStr=JSON.stringify(json);
	    debug("savePro _loadProIndex:"+_loadProIndex);
	   if(_loadProIndex>=0){
	       params.id=getProjsGrid().datagrid('getRows')[_loadProIndex];
	       ajaxSaveOrUpdatePro();
	   }else{
		 $.messager.prompt('查询条件保存', '请输入方案名称', function(r){
				if (r){
				    params.proName=r;
					ajaxSaveOrUpdatePro();
				}else{
					$.messager.alert('错误','你没有输入名称，不能保存');
				}
			});
	   }
	   
	  
		
		function ajaxSaveOrUpdatePro(){
		   $.ajax({
				url: url,
				data:params,
				type: 'post',
				dataType: 'json',
				error:function(data){
				$.messager.alert('错误','保存失败');
				},
				success: function(data){
					that.initProjsGrid();
					$.messager.alert('提示',"保存成功");
				}
				});
		}

	  
	}
	
	function deletePro(id){
	    if (isFunction(that.setting.deletePro)) {
		      that.setting.deletePro.call(that, id);
			  //清除记录的当前proj 加载index 和选择index
			  if(_loadProIndex==_proCurRowIndex && _loadProIndex!=-1){
			    _loadProIndex=-1;
				clear();
			   }
			   getProjsGrid().datagrid('deleteRow',_proCurRowIndex);
			   _proCurRowIndex=-1;
		}
	
	}
    
    function getData( key){
    	return $("body").data(key);
    }
    
    function setData(key,value){
    	$("body").data(key,value);
    }
    
    function getGrid(){
       return $('#dgser');	   
     }
	 
	function getProjsGrid(){
       return $('#projs');	   
     }
	 
	function getGridDitor(index,fieldName){
    	 return  getGrid().datagrid('getEditor', {
				index : index,field : fieldName});
     }
      
    function removeChilds(f){
            var childs = f.childNodes;    
			for(var i = childs.length - 1; i >= 0; i--) {          
				f.removeChild(childs[i]);      
			}   
    }
    
 
	function findOpt(optId) {
	    var allOpts=searchPage.operation.allOpts();
	    if(allOpts[optId]){
	        return allOpts[optId];
	    }else{
	        return "";
	    }
	}

	
    function findParamName(paramId) {
		var obj = getData(paramId);
		if (obj) {
			return obj.name;
		}
		return "";
	}

    	function findParamValuesName(paramId,valuesId){
    	   var obj=getData(paramId);
    	   if(obj && obj.values){
    	       for( var i=0;i<obj.values.length;i++){
    		       if(obj.values[i].id==valuesId){
    			      return obj.values[i].name;
    			   }  
    		   }
    	    }
    	  return "";
    	}
    
    
    	 function endEditing(){
    			if (_editIndex == undefined){
    			     return true;
    			   }
    			   
    			if (getGrid().datagrid('validateRow', _editIndex)){
    				getGrid().datagrid('endEdit', _editIndex);
    				_editIndex = undefined;
    						return true;
    				} else {
    					return false;
    				}
    		}

    	 
    	 function getString(){
    			var  rows=getGrid().datagrid('getRows');
    			var str="";
    			for(var i=0;i<rows.length;i++){
    			for(x in rows[i]){
    			     str=str+" "+x+":"+rows[i][x];
    			   }
    			   str=str+"\n";
    			}
				return str;
    		}
			
		
    	 function getSearchParms(){
		     var seaResult=new Array();
		     var  rows=getGrid().datagrid('getRows');
    		 for(var i=0;i<rows.length;i++){
				 var obj=new Object();
				 obj.id=rows[i].id;
				 obj.type=rows[i].type;
				 obj.value=rows[i].value;
				 obj.opt=rows[i].opt;
				 obj.relation=rows[i].relation;
				 
				 obj.name=rows[i].id;
				 obj.valStr=rows[i].value;
				 obj.optStr=rows[i].opt;
				 
    			 seaResult.push(obj);
    		}
				
    		return seaResult;
		  }
		  
		 function validateSetting(){
			  if(this.setting.key==''){
			     $.messager.alert('提示',"key 必须有值");
				 return false;
			   }
			   
			    if(this.setting.userId==''){
			     $.messager.alert('提示',"userId 必须有值");
				 return false;
			   }
			   
			 if(!this.setting.getProjsUrl){
			     $.messager.alert('提示',"getProjsUrl 必须有值");
				 return false;
			   }
			   
			 if(this.setting.saveProUrl==''){
			     $.messager.alert('提示',"saveProUrl 必须有值");
				 return false;
			   }
			   
			 if(!isFunction(this.setting.deletePro)){
			     $.messager.alert('提示',"deletePro 必须是函数");
				 return false;
			   }
			   
			if(this.setting.containerId==''){
			     $.messager.alert('提示',"containerId 必须有值");
				 return false;
			   }else if(this.setting.containerId.indexOf('#')==-1){
				   this.setting.containerId='#'+this.setting.containerId;
			   }
			   
			 return true;
			} 
			
			function createBaseHtml( mainContainerId){
			  var panel=$("<div class='easyui-panel' title='通用查询' style='height:300px;padding-top:1px;' > </div>");
			  var layout=$("<div class='easyui-layout' data-options='fit:true'  style='width:100%;' > </div>");
			  var west=$('<div data-options="region:\'west\'" title="方案" style="width: 195px;" ></div>').append("<input id='projs' />");
			  var center=$('<div  data-options="region:\'center\'" title="查询条件"  style="margin-left:1px;" > </div>').append('<table id="dgser" />');
			  west.appendTo(layout);
			  center.appendTo(layout);
			  panel.append(layout).appendTo($(mainContainerId));
			  $.parser.parse(panel.parent());
			  return panel;
			}
    	 
    	    function init(options){
    	    	this.setting=$.extend(this.setting,options);
				if(!validateSetting()){
				   return;
				}
				
				createBaseHtml(this.setting.containerId);
				
				
				_localVars.nameEditor.options.data=this.setting.fields;
    	    	for(var i=0;i<this.setting.fields.length;i++){
    	    		setData(this.setting.fields[i].id,this.setting.fields[i]);
    	    	}
	
    	    	getGrid().datagrid(_localVars.gridOpts);
				initProjsGrid();
    	    }
			
		
			
			function initProjsGrid(){
				getProjsGrid().datagrid(_localVars.grid2Opts);
				var params={key:this.setting.key, userId:this.setting.userId };
				getProjsGrid().datagrid('options').url=this.setting.getProjsUrl;
				debug('initProjsGrid getProjsUrl:'+this.setting.getProjsUrl);
				getProjsGrid().datagrid('load',params);
			}
			
			function setProjsGridData(data){
			   var fData=null;
			  	debug("setProjsGridData type:"+typeof data);
                if(typeof data =='string'){
                  fData=eval('(' + json + ')');
                }else if(typeof data =='object'){
					fData=data;
                }else{
				    $.messager.alert('提示',"错误类型数据，请检查");
				   return;
                }		
			  getProjsGrid().datagrid({data: fData });
			}
			
			function clear(){
			  getGrid().datagrid(_localVars.gridOpts);
			  loadData([]);
			 }
    	    
    	    function loadData(data){
			    var fData=null;
				debug("loadData type:"+typeof data);
                if(typeof data =='string'){
                  fData=eval('(' + json + ')');
                }else if(typeof data =='object'){
					fData=data;
                }else{
                   $.messager.alert('提示',"错误类型数据，请检查");
				   return;
                }				
			    getGrid().datagrid({data: fData });
			 }
			
    	 return function(options){
			  init(options);
			  /**
			   * 获得查询条件，已js array形式返回
			   */  
			  this.getArrayResult=function(){
			      if (!endEditing()) {
					  $.messager.alert('提示',"当前查询条件不完整，请检查");
					  return null;
			       }
			     return getSearchParms();
			  };
			  
			  /**
			   * 清除查询条件
			   */
			  this.clear=function(){
			     clear();
			   };
			   
			   /**
				* 获得查询条件，已json 字符串形式返回
			   */ 
			  this.getJsonResult=function(){
			     var result=this.getArrayResult();
				 if(result){
				    return JSON.stringify(result);
				  }else{
				     return null;
				   }
			  };
			  
			  /**
			   * load 给定的查询条件到界面
			   */
			  this.loadData=function(data){
			     return loadData(data);
			  };
			  
			  /**
			   * 判断查询条件编辑是否结束
			   */
			  this.endEditing=function(){
			    return endEditing();
			  };
			  
			  /**
			   * save 或者 update当前查询方案
			   */
			  this.savePro=function(){
			      savePro();
			  };
			  
			  /**
			   * 初始化
			   */
			  this.init=function(){
				  init();
			  };
			  
			  /**
			   * 设置查询方案数据手动
			   */
			  this.setProjsGridData=function(projsData){
				  setProjsGridData(projsData);
			  };
    	 };
})();




var inputs=[{id:'com',name:'公司',type:'enum',values:[{id:'1',name:'扭海'},{id:'2',name:'易处多'},{id:'3',name:'黑木堂'}]},
            {id:'age',name:'年龄',type:'num'},
            {id:'name',name:'姓名',type:'string'},
            {id:'birth',name:'出生日期',type:'date'}];
//this.setting={fields:[],key:'',userId:'',etProjsUrl:'',deletePro:'',saveProUrl:''};
var options={containerId:'#seaDiv',fields:inputs,key:'cosRill',userId:'duant',getProjsUrl:'file:///D:/work/Query/temp/projs.json',saveProUrl:'http://localhost/save.action',
				deletePro:function(id){
					alert("delete projs:"+id);
				} 
			};

/**
 * 手动设置方案数据
 */
function setProjsDataMan(){
	
var projsData=[
			{id:'1',name:'查询1',jsonStr:[
			  {id:'com',type:'enum',value:1, opt:'=',valStr:1,optStr:'=',relation:'OR'},
			  {id:'age',type:'num',value:23, opt:'=',value:'23',optStr:'=',relation:'OR'}
			 ]
			},
			{id:'2',name:'查询2',jsonStr:[
			  {id:'com',type:'num',value:1, opt:'=',valStr:1,optStr:'=',relation:'OR'},
			  {id:'birth',type:'date',value:'2013-08-15', opt:'=',valStr:'2013-08-15',optStr:'=',relation:'OR'}
			 ]
			}
			];
	sePage.setProjsGridData(projsData);
}



var sePage=null;	
$(function(){
    sePage=new comSearch(options);
    setProjsDataMan();
});

function getSearchRes(){
   alert(sePage.getArrayResult());
}

/**
 * 手动设置查询条件
 */
function loadData(){
 var cData=[
			 {id:'com',type:'string',value:1, opt:'=',relation:'OR'},
			 {id:'com',type:'string',value:1, opt:'=',relation:'OR'},
			];
   sePage.loadData(cData);
}



	