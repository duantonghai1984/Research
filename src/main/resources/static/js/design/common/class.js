if(typeof OO =='undefined' || !OO){
	var OO={};
}

OO.classExtend=function(subClass, superClass) {
    var F = function() {};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    subClass.superClass = superClass;
    if(superClass.prototype.constructor == Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
};

OO.Interface=function(name,methods){
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