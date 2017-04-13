/**
 * @author duant
 */
var GiantCorp=window.GiantCorp||{};
 var Singleten={
 	attribute1:true,
	attribute2:10,
	
	method1:function(){
		alert("method1");
	},
	
	method2:function(arg){
		
	}
 };
 
 
 GiantCorp.DataParser=(function(){
 	
	var whitespaceRegex=/\s+/;
	
	function stripWhitespace(){
		return "fd";
	}
	
	return{
		stringToArray:function(){
			
		}
		
	};
	
 })();
 
 
 GiantCorp.DataParser1=(function(){
 	var uniqueIntance=null;
 	
	function constructor(){
		
	}
	
	return{
		getInstance:function(){
			if(uniqueIntance==null){
				uniqueIntance=new constructor();
			}
			return uniqueIntance;
		}
	};
 	
 });
 
 
var one=GiantCorp.DataParser;


 
 function test(){
 	Singleten.attribute1=false;
	var total=Singleten.attribute2+5;
	var result=Singleten.method1();
 }
