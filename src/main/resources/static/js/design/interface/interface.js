/**
 * @author duant
 */

 
 /**
 * @author duant
 */
var baz;
(function(foo, bar){
    baz = function(){
        alert(foo);
        return foo * bar;
    };
})(10, 2);


//Constructor
var Interface=function(name,methods){
	if(arguments.length!=2){
		throw new Error("Interface contructor expect 2");
	}
	this.name=name;
	this.methods=[];
	for(var i=0,len=methods.length;i<len;i++){
		if(typeof methods[i]!=='string'){
			throw new Error("must be string");
		}
		this.methods.push(mehtods[i]);
	}
};

Interface.ensureImplements=function(object){
	if(arguments.length < 2) {
		throw new Error("Function Interface.ensureImplements called with " +
		arguments.length + "arguments, but expected at least 2.");
	}
for(var i = 1, len = arguments.length; i < len; i++) {
	var interfaces = arguments[i];
	if(interfaces.constructor !== Interface) {
		throw new Error("Function Interface.ensureImplements expects arguments"
		+ "two and above to be instances of Interface.");
	}

	for(var j = 0, methodsLen = interfaces.methods.length; j < methodsLen; j++) {
		var method = interfaces.methods[j];
		if(!object[method] || typeof object[method] !== 'function') {
		throw new Error("Function Interface.ensureImplements: object "
		+ "does not implement the " + interfaces.name
		+ " interface. Method " + method + " was not found.");
		}
	 }
 }
};

var Book=function(newIsbn,newTitle,newAutor){
	var isbn,title,author;
	
	function checkIsbn(isbn){
		alert("check isbn");
	}
	
	this.getIsbn=function(){
		return isbn;
	};
	
	this.setIsbn=function(newIsbn){
		checkIsbn(newIsbn);
		isbn=newIsbn;
	};
	
	this.setIsbn(newIsbn);
};

Book.prototype={
	dispay:function(){
		alert(this.getIsbn());
	}
};



var Book1=(function(){
	var numOfBooks=0;
	function checkIsbn(isbn){
		
	};
	
	return function(newIsbn){
		var isbn;
		numOfBooks++;
		alert(numOfBooks);
	};
})();




