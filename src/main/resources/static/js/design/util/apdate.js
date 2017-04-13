(function($){
    var sourcTag=1; //1, kuaijiqijian, 2  danju riqi

	function getStart(target){
	   if(sourcTag==1){
		var y=$('#start1',target).numberspinner("getValue");
		var m=parseInt($('#end1',target).numberspinner("getValue"));
		if(m<10){
			m='0'+m;
		}
		var date= new Date();
		return y+"-"+m+"-01";
	  }else{
	     return $('#sdate',target).datebox('getValue');
	  }
	}
	
	function getEnd(target){
	  if(sourcTag==1){
		var y=$('#start2',target).numberspinner("getValue");
		var m=parseInt($('#end2',target).numberspinner("getValue"));
		var mStr=m;
		if(m<10){
			mStr='0'+m;
		}
		if(m==1 || m==3 || m==5 ||m==7 || m==8 || m==10 || m==12){
		    return y+"-"+mStr+"-31";
		}else if(m==2){
			return y+"-"+mStr+"-28";
		}else{
		   return y+"-"+mStr+"-30";
		}
	  }else{
	     return $('#edate',target).datebox('getValue');
	  }
	}
	
	
	function valiDate(target){
		var start=getStart(target);
		var end=getEnd(target);
		if(start>end){
			if(sourcTag==1){
			  $.messager.alert('提示','起始会计期间大于结束会计期间，请检查');
			}else{
			  $.messager.alert('提示','起始单据日期大于结束单据日期，请检查');
			}
			return false;
		}
		return true;
    }
	
	function createHtml(target){
	    var ul=$('<ul ></ul>').appendTo(target);
		if($.fn.apDate.defaults.ulCls){
		   ul.addClass($.fn.apDate.defaults.ulCls);
		}
		var li1=$('<li ></li>').appendTo(ul);
		var li2=$('<li></li>').appendTo(ul);
		if($.fn.apDate.defaults.liCls){
			li1.addClass($.fn.apDate.defaults.liCls);
			li2.addClass($.fn.apDate.defaults.liCls);
		}
		
		$('<input type="radio" checked="true" name="radio">会计期间&nbsp;&nbsp;</input>').appendTo(li1).click(function(){
			 $("div",li2).toggleClass("hide");
			 $("div",li1).toggleClass("hide");
			 sourcTag=1;
		});
		
        $('<input type="radio"  name="radio">单据日期</input>').appendTo(li1).click(function(){
        	$("div",li2).toggleClass("hide");
			$("div",li1).toggleClass("hide");
			sourcTag=2;
		});
        var width=parseInt($.fn.apDate.defaults.width);
		
        var div1='<div style="height:50px;"><span class="tit">会计期间：</span>';
        div1=div1+'<input type="text" id="start1"  style="width:60px;"  class="easyui-numberspinner"  data-options="editable:false"/>';
		div1=div1+'<input type="text" id="end1" style="width:40px;" class="easyui-numberspinner"  data-options="editable:false"/>&nbsp;期<br/>';
        div1=div1+'<span class="tit">至：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>';
        div1=div1+'<input type="text" id="start2" style="width:60px;" class="easyui-numberspinner"  data-options="editable:false"/>';
        div1=div1+'<input type="text" id="end2" style="width:40px;" class="easyui-numberspinner"  data-options="editable:false"/>&nbsp;期';
        div1=div1+'</div>';
        $(div1).appendTo(li2);
		
		
		
		var div2='<div ><span class="tit">单据日期：</span>';
        div2=div2+'<input id="sdate" type="text" class="easyui-datebox" style="width:90px;"  data-options="editable:false"/><br/>';
        div2=div2+'<span class="tit">至：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>';
        div2=div2+'<input id="edate" type="text" class="easyui-datebox" style="width:90px;" data-options="editable:false"/>';
        div2=div2+'</div>';
		$(div2).appendTo(li2).addClass('hide');
		
		$.parser.parse(ul.parent());
		
		var nowDate = new Date();
		
		$("input[id*='start']").numberspinner({   
	    value: nowDate.getFullYear(),
	    min: 1970,
	    editable: false,
	    increment:1
	   }); 
	   
	   $("input[id*='end']").numberspinner({
		value: nowDate.getMonth()+1,
	    min: 1,
	    max:12,
	    editable: false,
	    increment:1
	});  
	
	
	var date = nowDate.getFullYear()+'-';
	var month = nowDate.getMonth()+1;
	if(month<10){
		month='0'+month;
	}
	var d = nowDate.getDate();
	if(d<10){
		d='0'+d;
	}
	
	$('#sdate').datebox('setValue',date + month+'-01');
	$('#edate').datebox('setValue',date + month+'-'+d);
        
	}
	
	$.fn.apDate=function(options,params){
		
		if (typeof options == 'string') {
			switch(options){
			case 'getStart':
				return getStart(this[0]);
			case 'getEnd':
				return getEnd(this[0]);
			case 'getType':
			     return sourcTag;
			case 'valiDate':
				 return valiDate(this[0]);
			}
		 }
		
		options = options || {};
		
		return this.each(function(){
			createHtml(this);
		});
		
		
	};
	
	
	$.fn.apDate.defaults={
		liCls: '',
		ulCls: ''
	};
	
})(jQuery);