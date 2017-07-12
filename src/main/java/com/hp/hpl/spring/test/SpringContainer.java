package com.hp.hpl.spring.test;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.hp.hpl.spring.beans.HelloWorld;
import com.hp.hpl.spring.beans.User;

public class SpringContainer {
	protected ApplicationContext context;
	
	public SpringContainer(){
		this.init();
	}
	
	
	private void init(){
		/* AbstractApplicationContext.class;
		 DefaultListableBeanFactory;
		BeanNameAware*/
		//PropertyOverrideConfigurer
		 context=new ClassPathXmlApplicationContext("/com/hp/hpl/spring/test/spring.xml");
		
	}
	
	public void test(){
		 User user=(User)context.getBean("userFacotry");
		 System.out.println(user);
	}
	
	
	public void testDepends(){
		HelloWorld user=(HelloWorld)context.getBean("helloWorld");
		 System.out.println(user);
	}
	

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		
		SpringContainer spring=new SpringContainer();
		spring.testDepends();

	}

}
