package com.hp.hpl.spring.test;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.hp.hpl.spring.beans.User;

public class SpringContainer {
	protected ApplicationContext context;
	
	public SpringContainer(){
		this.init();
	}
	
	
	private void init(){
		 context=new ClassPathXmlApplicationContext("spring.xml");
		
	}
	
	public void test(){
		 User user=(User)context.getBean("user");
	}
	

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		
		SpringContainer spring=new SpringContainer();
		spring.test();

	}

}
