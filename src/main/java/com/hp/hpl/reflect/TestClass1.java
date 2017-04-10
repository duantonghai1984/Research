package com.hp.hpl.reflect;

public class TestClass1 {
	
	private String name;
	public String value;
	
	
	public TestClass1(){
		
	}
	
	public TestClass1(String name,String value){
		this.name=name;
		this.value=value;
	}
	
	private String getName(){
		return this.name;
	}
	
	public String getValue(){
		return this.value;
	}

}
