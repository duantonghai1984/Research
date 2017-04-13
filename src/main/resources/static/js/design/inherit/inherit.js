/**
 * @author duant
 */

 /**
 * Class Person
 * @param {Object} name
 */
 function Person(name){
 	this.name=name;
 }
 
Person.prototype.getName=function(){
	return this.name;
};


/**
 * Class Author
 * @param {Object} name
 * @param {Object} books
 */
function Author(name,books){
	Person.call(this,name);
	this.books=books;
}

Author.prototype=new Person();
//Author.prototype.constructor=Author;
Author.prototype.getBooks=function(){
	return this.books;
};

function extend(subClass,superClass){
	var F=function(){};
	F.prototype=superClass.prototype;
	subClass.prototype=new F();
	subClass.prototype.constructor=subClass;
}

function AuthorA(name,books){
	Person.call(this,name);
	this.books=books;
}

extend(AuthorA,Person);
AuthorA.prototype.getBooks=function(){
	return this.books;
};
