
/**
 * @author duant
 */

/*************************************************************************/
 Function.prototype.method=function(name,fn){
 	this.prototype[name]=fn;
	return this;
 };
 
/*************************************************************************/ 
 var Interface=function(name,methods){
 	if(arguments.length!=2){
		throw new Error("the argments must be extract 2");
	}
	this.name=name;
	this.methods=[];
	for(var i=0,len=methods.length;i<len;i++){
		if(typeof methods[i] !=='string'){
			throw new Error("The method name must be string");
		}
		this.methods.push(methods[i]);
	}
 } ;
 
 //static class method
 Interface.ensureImplements=function(object){
 	if(arguments.length<2){
		throw new Error("Function interface must be more than 2");
	}
	
	for(var i=1,len=arguments.length;i<len;i++){
		var interface1=arguments[i];
		if(interface1.constructor !== Interface ){
			throw new Error("function interface.ensureImplements expects arguments must be interface");
		}
		
		for(var j=0,methodsLen=interface1.methods.length;j<methodsLen;j++){
			var method=interface1.methods[j];
			if(!object[method]||typeof object[method]!=='function'){
				throw new Error("Function interface.ensureImplements:object "+
				"does not implement the "+interface1.name
				+" interface.Method "+ method+" was not found.");
			}
		}
	}
 };
 
 
 
 
 /**********************************************************************/
/**
 * Test class interface
 */

var ResultSet=new Interface('ResultSet',['getDate','getResult']);

var ResultFormat=function(resultObject){
	try {
		Interface.ensureImplements(resultObject, ResultSet);
		this.resultObject = resultObject;
		alert('right');
	}catch(err){
		alert(err);
	}
};

new ResultFormat(new Object());

/**********************************************************************/
/*
 * demonstrate the class's private attributes and private methods
 * demonstrate the class's public attributs and public methods
 */

  var Book=function(newIsbn,newTitle,newAuthor){
  	
	//private attributes
	var isbn,title,author;
	
	//private method
  	function checkIsbn(isbn){
		alert('check isbn');
	};
	
	//privileged methods
	this.getIsbn=function(){
		return isbn;
	};
	
	isbn=newIsbn;
  }
  
  //public method
  Book.prototype={
  	display:function(){
		//checkIsbn('fdfd');
		alert(this.getIsbn());
	}
  }

 var book1=new Book("fdf","fdfd","fdfd");
     book1.display();
 
 /**********************************************************************/
 
 /* Anim class */
var Anim=function(){
	
};

Anim.method('start',function(){
	alert('anim start');
});

Anim.method('stop',function(){
	alert('anim stop');
});

/***************************************************************************/
/**
 * Create no name function
 */
var baz;

(function(){
	var fo=10;
	var bar=2;
	baz=function(){
		return fo*bar;
	};
})();


/*************************************************************************/
/**
 * create object
 */
function Person(name,age){
	this.name=name;
	this.age=age;
}

Person.prototype={
	getName:function(){
		return this.name;
	}
}

Person("wang","longfei");

//var p=new Person("duan1","tonghai");
//var k= new Person("wang",'tonghai');
alert(window.age);

/****************************************************************************/


