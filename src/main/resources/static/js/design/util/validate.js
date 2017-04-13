$(function() {
	$.extend($.fn.validatebox.defaults.rules, {
		mobile : {
			validator : function(value, param) {
				return /^13[0-9]{1}[0-9]{8}$|^15[012356789]{1}[0-9]{8}$|^18[0256789]{1}[0-9]{8}$/.test(value);
			},
			message : '请输入有效的手机号码'
		},
		email : {
			validator : function(value, param) {
				return  /^[-_A-Za-z0-9\.]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/.test(value);
			},
			message : '请输入有效的邮箱'
		},
		phone : {
			validator : function(value, param) {
				return /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/.test(value);
			},
			message : '请输入有效的电话号码,如010-88888888'
		},
		code : {
			validator : function(value, param) {
				return /^[0-9a-zA-Z]{1,20}$/.test(value);
			},
			message : '请输入[1-20]位由字母或数字编号'
		},
		account : {
			validator : function(value, param) {
				return /^[0-9]{1,30}$/.test(value);
			},
			message : '请输入[1-30]位由数字组成的银行账号'
		},
		amount : {
			validator : function(value, param) {
				return /^([1-9]\d{0,12}|0)(\.\d{1,6})?$/.test(value);
			},
			message : '请输入正确的金额'
		},
		 minValue: {
			 validator: function(value, param){
			    	if(isNaN(value)){
			    		return false;
			    	}
			       return value >= param[0];
			    },
			message: '请输入一个大于等于{0}的数字.'
		},
		maxValue: {
			 validator: function(value, param){
			        	if(isNaN(value)){
			        		return false;
			        	}
			           return value <= param[0];
			  },
	    message: '请输入一个小于等于{0}的数字.'
	  },
	  selectValue: {
			 validator: function(value, param){
			        	if(value.indexOf("选择")!=-1 || value==-1 || value == ''){
			        		return false;
			        	}else{
			        		return true;
			        	}
			  },
	    message: '请从下拉框里选择一项'
	  }
	});   
});