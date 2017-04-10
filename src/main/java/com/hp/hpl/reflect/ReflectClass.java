package com.hp.hpl.reflect;

import static java.lang.System.out;

import java.lang.reflect.Array;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class ReflectClass {
	private Class clz;
	
	public ReflectClass(Class clz){
	  this.clz=clz;	
	}
	
	public void printFields(){
		Field[] fields=this.clz.getFields();
		out.println("public fields ");
		for(Field field:fields){
			out.println("field:"+field.getName());
		}
		
		Field[] dfields=this.clz.getDeclaredFields();
		out.println("all fields ");
		for(Field field:dfields){
			out.println("field:"+field.getName());
		}
	}
	
	public void printMethod(){
		
		/*Method[] methods=this.clz.getMethods();
		for(Method method:methods){
			out.println(method.getName());
		}*/
		out.println(this.clz.getClasses().toString());
		Constructor[] cs=this.clz.getConstructors();
		for(Constructor  c:cs){
		   out.println(c.toString());
		}
	}
	
	
	public Object copyObject(Object obj) throws Exception{
		Class<?> classType=obj.getClass();
		out.println("classType:"+classType);
		
		Object objCopy=classType.newInstance();
		
		Field[] fields=classType.getDeclaredFields();
		for(Field field:fields){
			String fieldName=field.getName();
			String firstLetter = fieldName.substring(0, 1).toUpperCase();
            String getMethodName = "get" + firstLetter + fieldName.substring(1);
            String setMethodName = "set" + firstLetter + fieldName.substring(1);
            
            Method getMethod=classType.getMethod(getMethodName, new Class[]{});
            Method setMethod=classType.getMethod(setMethodName, new Class[]{field.getType()});
            
            Object value=getMethod.invoke(obj, new Object[]{});
            setMethod.invoke(objCopy, new Object[]{value});
		}
		return objCopy;
	}
	
	
	public void createArry() throws Exception{
		Class<?> clz=Class.forName("java.lang.String");
		Object array=Array.newInstance(clz, 10);
		Array.set(array, 5, "hello");
		Array.get(array, 5);
	}
	
	public static void main(String[] args) throws Exception{
		ReflectClass reflect=new ReflectClass(TestClass1.class);
		Customer cus=new Customer();
		cus.setName("duant");
		cus.setValue("wang");
		Customer copy=(Customer)reflect.copyObject(cus);
		System.out.println(copy.getName());
		//reflect.printMethod();
	}

}
