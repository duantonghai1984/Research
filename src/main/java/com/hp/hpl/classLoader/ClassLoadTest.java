package com.hp.hpl.classLoader;

import java.net.URL;
import java.net.URLClassLoader;


public class ClassLoadTest {
	
	public static void main(String[] args) throws Exception{
		URL url = new URL("file:C:/test/test.jar");
		URLClassLoader myClassLoader=new  URLClassLoader(new URL[]{ url } ); 
		myClassLoader.loadClass("com.hp.hpl.reflect.Customer");
		System.out.println("over");
	}

}
