package com.hp.hpl.hessian.client;

import java.net.MalformedURLException;

import com.caucho.hessian.client.HessianProxyFactory;
import com.hp.hpl.hessian.server.IHessian;

public class TestHessian {
	
	
	private Object obj;
	

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		 String url = "http://localhost:8080/hessian/hessian.ao";  
		        HessianProxyFactory factory = new HessianProxyFactory();  
		         IHessian h = null;  
		         try {  
		             h = (IHessian) factory.create(IHessian.class, url);  
		         } catch (MalformedURLException e) {  
		             System.out.println("occur exception: " + e);  
		         } 
		        Object obj= h.say("msg");
		        
		        
		        System.out.println(h.say("world"));  
		        System.out.println(h.getMap());  
		        System.out.println(h.getList());  

	}

}
